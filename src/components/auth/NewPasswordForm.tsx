'use client'

import type * as z from 'zod'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { NewPasswordSchema } from '@/schemas'
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
import { newPassword } from '@/actions/new-password'
import { useSearchParams } from 'next/navigation'

export default function NewPasswordForm() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const [token, email] = [searchParams.get('token'), searchParams.get('email')]
  console.log(token, email)

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: ''
    }
  })

  const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      newPassword(values, token, email)
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)
        }).catch((error) => {
          // setError('Error en el servidor')
          console.error(error)
        })
    })
  }

  return (
    <CardWrapper
      headerLabel='Ingresa tu nueva contraseña'
      backButtonLabel='Volver a login'
      backButtonHref='/auth/login'
      >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-6'
        >
          {/* inputs del formulario */}
          <div className='space-y-4'>
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
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>

                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold'>Confirmar contraseña</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>

                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type='submit'
            disabled={isPending}
            className='w-full'
          >
            Cambiar contraseña
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
