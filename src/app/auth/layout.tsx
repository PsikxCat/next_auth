import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex_center_column h-full bg_blue_gradient'>
      {children}
    </div>
  )
}
