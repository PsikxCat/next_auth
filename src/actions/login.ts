'use server'

import type * as z from 'zod'

import { LoginSchema } from '@/schemas'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { ok: false, error: 'Error en los campos!' }
  }

  return { ok: true, success: 'Sesion iniciada correctamente!' }
}
