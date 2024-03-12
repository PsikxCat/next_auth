'use client'

import type * as z from 'zod'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { LoginSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CardWrapper, FormError, FormSuccess } from '@/components'
import { login } from '@/actions/login'

export default function LoginForm() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [showTwoFactorField, setShowTwoFactorField] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }

          if (data?.success) {
            // form.reset()
            setSuccess(data.success)
          }

          if (data?.twoFactorToken) setShowTwoFactorField(true)
        }).catch(() => {
          // setError('Error en el servidor. Inténtalo de nuevo.')
        })
    })
  }

  return (
    <CardWrapper
      headerLabel='Bienvenido de vuelta'
      backButtonLabel='¿No tienes cuenta?'
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-6'
        >
          {/* inputs del formulario */}
          <div className='space-y-4'>
            {!showTwoFactorField && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bold'>Email</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='tucorreo@mail.com'
                          type='email'
                        />
                      </FormControl>

                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bold'>Contraseña</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='********'
                          type='password'
                        />
                      </FormControl>

                      <Button
                        size='sm'
                        variant='link'
                        asChild
                        className='px-0 font-normal'
                      >
                        <Link href={'/auth/forgot-password'}>
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </Button>

                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </>
            )}

            {showTwoFactorField && (
              <FormField
                control={form.control}
                name='twoFactorCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold'>Código de verificación 2FA</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='XXXXXX'
                        type='text'
                      />
                    </FormControl>

                    <FormMessage/>
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type='submit'
            disabled={isPending}
            className='w-full'
          >
            {showTwoFactorField ? 'Verificar' : 'Iniciar sesión'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
