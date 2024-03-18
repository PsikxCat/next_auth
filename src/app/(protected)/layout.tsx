import { Navbar } from '@/app/(protected)/_components'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className='h-full w-full flex_center_column gap-y-10 bg_blue_gradient'>
      <Navbar />
      {children}
    </div>
  )
}
