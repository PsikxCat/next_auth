import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export default function Home() {
  return (
    <main className="flex_center_column h-full bg_blue_gradient" >
      <div className="space-y-6 text-center">
        <h1 className={cn(
          'text-6xl font-semibold text-white drop-shadow-md',
          poppins.className
        )}>
          🔐 Auth
        </h1>

        <p className="text-white text-lg">Un servicio simple de autenticación</p>

        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Iniciar sesión
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
