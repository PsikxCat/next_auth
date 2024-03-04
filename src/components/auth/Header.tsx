import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

interface HeaderProps {
  label: string
}

export default function Header({ label }: HeaderProps) {
  return (
    <div className='flex_center_column w-full gap-y-4'>
      <h1 className={cn(
        'text-3xl font-semibold',
        poppins.className
      )}>
        🔐 Auth
      </h1>

      <p className='text-muted-foreground text-sm'>
        {label}
      </p>
    </div>
  )
}
