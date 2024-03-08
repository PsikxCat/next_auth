'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export default function Social() {
  const handleClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
      .then(() => { console.log('Redirecting...') })
      .catch((error) => { console.error(error) })
  }

  return (
    <div className="flex_center w-full gap-x-2">
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-full'
        onClick={() => { handleClick('google') }}
      >
        <FcGoogle className='h-5 w-5' />
      </Button>

      <Button
        size={'lg'}
        variant={'outline'}
        className='w-full'
        onClick={() => { handleClick('github') }}
      >
        <FaGithub className='h-5 w-5' />
      </Button>
    </div>
  )
}
