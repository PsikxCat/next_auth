import { db } from '@/lib/db'

export const getVerificationTokenByToken = async (email: string, token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { email_token: { email, token } }
    })

    return verificationToken
  } catch (error) {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    })

    return verificationToken
  } catch (error) {
    return null
  }
}
