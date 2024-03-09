'use server'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'

export const newVerification = async (token: string, email: string) => {
  const existingToken = await getVerificationTokenByToken(email, token)
  if (!existingToken) return { ok: false, error: 'Token invalido!' }

  const hasExpired = new Date(existingToken.expires as Date) < new Date()
  if (hasExpired) return { ok: false, error: 'Token expirado!' }

  const existingUser = await getUserByEmail(email)
  if (!existingUser) return { ok: false, error: 'Email no encontrado' }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  })

  await db.verificationToken.delete({ where: { id: existingToken.id } })

  return { ok: true, success: 'Email verificado!' }
}
