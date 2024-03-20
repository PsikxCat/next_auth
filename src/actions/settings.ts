'use server'

import type * as z from 'zod'
import { hash } from 'bcryptjs'

import { db } from '@/lib/db'
import { type SettingsSchema } from '@/schemas'
import { getUserById } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await getCurrentUser()
  if (!user) return { error: 'No estás autenticado' }

  const dbUser = await getUserById(user.id!)
  if (!dbUser) return { error: 'Usuario no encontrado' }

  if (values.password) {
    const hashedPassword = await hash(values.password, 10)
    values.password = hashedPassword
  }
  if (values.newPassword) delete values.newPassword

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  })

  return { success: 'Configuración actualizada' }
}
