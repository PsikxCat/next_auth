import { db } from '@/lib/db'

export const getTwoFactorTokenByToken = async (email: string, token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { email_token: { email, token } }
    })

    return twoFactorToken
  } catch (error) {
    return null
  }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }
    })

    return twoFactorToken
  } catch (error) {
    return null
  }
}
