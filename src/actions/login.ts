'use server'

import type * as z from 'zod'
import { AuthError } from 'next-auth'

import { db } from '@/lib/db'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/data/user'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { ok: false, error: 'Error en los campos!' }
  }

  const { email, password, twoFactorCode } = validateFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser?.password || !existingUser?.email) {
    return { ok: false, error: 'Este correo no existe.' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    if (verificationToken) return { ok: true, success: 'Email de confirmación enviado!' }
    else return { ok: false, error: 'Error al enviar el correo de confirmación!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
      if (!twoFactorToken) return { ok: false, error: 'Error en el token de 2FA!' }

      if (twoFactorToken.token !== twoFactorCode) return { ok: false, error: 'Código de 2FA incorrecto!' }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()
      if (hasExpired) return { ok: false, error: 'El token de 2FA ha expirado!' }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      })

      const existingConfirmation = await db.twoFactorConfirmation.findFirst({
        where: { userId: existingUser.id }
      })

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        })
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { ok: true, success: 'Email de 2FA enviado!', twoFactorToken: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })

    return { ok: true, success: 'Iniciando sesión...' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return { ok: false, error: 'Credenciales incorrectas!' }
        }
        default: {
          return { ok: false, error: 'Error inesperado!' }
        }
      }
    }

    // es necesario lanzar este throw error para que redireccione, de lo contrario no lo hace (bug?)
    throw error
  }
}
