'use client'

import { useSearchParams } from 'next/navigation'

import { CardWrapper, FormError } from '@/components'

export default function ErrorCard() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Este correo ya esta registrado con otro metodo de autenticacion'
    : 'Error Inesperado'

  return (
    <CardWrapper
      headerLabel='Algo salio mal...'
      backButtonLabel='Volver a login'
      bachButtonHref='/auth/login'
    >
      <div className='flex_center_column gap-y-2 m-auto'>
        <FormError message={urlError} />
      </div>
    </CardWrapper>
  )
}
