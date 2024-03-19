import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Ingresa un correo válido'
  }),
  password: z.string().min(1, {
    message: 'Una contraseña es requerida'
  }),
  twoFactorCode: z.optional(z.string())
})

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: 'Un nombre es requerido'
  }),
  email: z.string().email({
    message: 'Ingresa un correo válido'
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres'
  })
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Ingresa un correo válido'
  })
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres'
  }),
  passwordConfirmation: z.string()
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirmation']
})

export const SettingsSchema = z.object({
  name: z.optional(z.string())
})
