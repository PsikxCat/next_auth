import NextAuth from 'next-auth'

import authConfig from '@/auth.config'
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoogedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) return

  if (isAuthRoute) {
    if (isLoogedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))

    return
  }

  if (!isLoogedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    // console.log('nextUrl.pathname --->', nextUrl.pathname)
    //     console.log('nextUrl.search --->', nextUrl.search)
    if (nextUrl.search) callbackUrl += nextUrl.search
    // console.log('encodedCallbackUrl --->', encodeURIComponent(callbackUrl))
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ))
  }
})

// con este regex, el middleware se ejecuta en todas las rutas que no sean archivos estaticos, la raiz o las rutas api y trpc, de esta manera se protegen todas las rutas de la aplicacion
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
