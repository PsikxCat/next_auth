'use server'

import type * as z from 'zod'

import { RegisterSchema } from '@/schemas'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values)

  if (!validateFields.success) {
    return { ok: false, error: 'Error en los campos!' }
  }

  return { ok: true, success: 'Correo enviado!' }
}
