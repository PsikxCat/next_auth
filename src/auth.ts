import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import type { UserRole } from '@prisma/client'
import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'
import { db } from '@/lib/db'

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
  callbacks: {
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