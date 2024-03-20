'use server'

import type * as z from 'zod'
import bcrypt, { hash } from 'bcryptjs'

import { db } from '@/lib/db'
import { type SettingsSchema } from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '../lib/mail'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await getCurrentUser()
  if (!user) return { error: 'No estás autenticado' }

  const dbUser = await getUserById(user.id!)
  if (!dbUser) return { error: 'Usuario no encontrado' }

  if (user.isOAuth) {
    delete values.email
    delete values.password
    delete values.newPassword
    delete values.isTwoFactorEnabled
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'El correo electrónico ya está en uso' }
    }

    const verificationToken = await generateVerificationToken(values.email)

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { ok: true, success: 'Email de confirmación enviado!' }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const isValid = await bcrypt.compare(values.password, dbUser.password)

    if (!isValid) {
      return { error: 'La contraseña actual no es correcta' }
    }

    const hashedPassword = await hash(values.newPassword, 10)

    values.password = hashedPassword
    delete values.newPassword
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  })

  return { success: 'Configuración actualizada' }
}
