import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next Auth V5',
  description: 'Un servicio simple de autenticacion'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="es">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}

// el wrappeo de SessionProvider se hace para mostrar el ejemplo de captura de session en CSR components
