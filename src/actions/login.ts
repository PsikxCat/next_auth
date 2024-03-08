'use server'

import type * as z from 'zod'
import { AuthError } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { ok: false, error: 'Error en los campos!' }
  }

  const { email, password } = validateFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser?.password || !existingUser?.email) {
    return { ok: false, error: 'Este correo no existe.' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)

    await sendVerificationEmail(verificationToken.email as string, verificationToken.token as string)

    if (verificationToken) return { ok: true, success: 'Email de confirmación enviado!' }
    else return { ok: false, error: 'Error al enviar el correo de confirmación!' }
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

    // es necesario lanzar el error para que redirija, de lo contrario no lo hace (bug?)
    throw error
  }
}
