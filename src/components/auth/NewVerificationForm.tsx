'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

import { CardWrapper, FormError, FormSuccess } from '@/components'
import { newVerification } from '@/actions/new-verification'

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const searchParams = useSearchParams()
  const [token, email] = [searchParams.get('token'), searchParams.get('email')]

  const handleSubmit = useCallback(() => {
    if (!token || !email) {
      setError('Token invalido!')
      return
    }

    newVerification(token, email)
      .then((data) => {
        setError(data.error)
        setSuccess(data.success)
      }).catch((error) => {
        console.error(error)
        setError('Algo salio mal! Intentalo de nuevo.')
      })
  }, [token, email])

  useEffect(() => {
    handleSubmit()
  }, [handleSubmit])

  return (
    <CardWrapper
      headerLabel='Verificando tu cuenta'
      backButtonLabel='Volver a login'
      backButtonHref='/auth/login'
    >
      <div className='flex_center_column w-full '>
        {!success && !error && <BeatLoader color='#000' />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
