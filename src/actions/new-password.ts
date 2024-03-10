'use server'

import type * as z from 'zod'

import { NewPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
  email?: string | null
) => {
  if (!token || !email) return { error: 'Token inválido' }

  const validateFields = NewPasswordSchema.safeParse(values)
  if (!validateFields.success) return { ok: false, error: validateFields.error.message }

  const { password } = validateFields.data

  const existingToken = await getPasswordResetTokenByToken(email, token)
  if (!existingToken) return { ok: false, error: 'Token inválido' }

  const hasExpired = new Date(existingToken.expires as Date) < new Date()
  if (hasExpired) return { ok: false, error: 'Token expirado' }

  const existingUser = await getUserByEmail(existingToken.email as string)
  if (!existingUser) return { ok: false, error: 'Email no encontrado' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword
    }
  })

  await db.passwordResetToken.delete({ where: { id: existingToken.id } })

  return { success: 'Contraseña actualizada!' }
}
