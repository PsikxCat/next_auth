'use server'

import type * as z from 'zod'
import { AuthError } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { ok: false, error: 'Error en los campos!' }
  }

  const { email, password } = validateFields.data

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
