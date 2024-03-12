'use server'

import type * as z from 'zod'

import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values)

  if (!validateFields.success) return { ok: false, error: 'Email invalido!' }

  const { email } = validateFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser?.email) return { ok: false, error: 'Este correo no existe.' }

  const passwordResetToken = await generatePasswordResetToken(email)

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

  if (passwordResetToken) return { ok: true, success: 'Email de confirmación enviado!' }
  else return { ok: false, error: 'Error al enviar el correo de confirmación!' }
}
