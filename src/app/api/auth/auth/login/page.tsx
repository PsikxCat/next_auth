'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ExistoPorError() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlError = searchParams.get('error')
  router.push(`/auth/error?error=${urlError}`)

  return <div className='w-full h-full bg_blue_gradient'/>
}

/**
 * /api/auth/auth/login -> /auth/error
 * hay un error al redireccionar a /auth/error ya que redirecciona a este path /api/auth/auth/login
 * hasta que se encuentre la causa del error, se redirecciona desde aqui a /auth/error pasando los searchParams
*/
