'use client'

import { useRouter } from 'next/navigation'

interface LoginButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export default function LoginButton({ children, mode = 'redirect', asChild }: LoginButtonProps) {
  const router = useRouter()

  const handleClick = () => { if (mode === 'redirect') router.push('/auth/login') }

  if (mode === 'modal') return <span>TODO: Implementar modal</span> // # TODO: Implementar modal

  return (
    <span className="cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  )
}
