import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import type { UserRole } from '@prisma/client'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'

declare module 'next-auth' {
  interface User {
    role: UserRole
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      if (user?.id) {
        const existingUser = await getUserById(user.id)
        // Previene el inicio de sesión si el correo no ha sido verificado
        if (!existingUser?.emailVerified) return false

        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id)

          if (!twoFactorConfirmation) return false

          // Borrar el token de confirmación de dos factores para el siguiente inicio de sesión o crearle un expire time?
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          })
        }
      }

      return true
    },
    async session({ session, token }) {
      if (token.role && session.user) session.user.role = token.role as UserRole
      if (token.sub && session.user) session.user.id = token.sub

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
})
