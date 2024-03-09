import { db } from '@/lib/db'

export const getPasswordResetTokenByToken = async (email: string, token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { email_token: { email, token } }
    })

    return passwordResetToken
  } catch (error) {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email }
    })

    return passwordResetToken
  } catch (error) {
    return null
  }
}
