'use server'

import type * as z from 'zod'
import bcrypt from 'bcryptjs'

import { RegisterSchema } from '@/schemas'
import { db } from '@/lib/db'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { getUserByEmail } from '@/data/user'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values)
  if (!validateFields.success) return { ok: false, error: 'Error en los campos!' }

  const { name, email, password } = validateFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)
  if (existingUser) return { ok: false, error: 'Este correo ya existe!' }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { ok: true, success: 'Email de confirmación enviado!' }
}
