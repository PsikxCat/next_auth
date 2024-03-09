'use client'

import type * as z from 'zod'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ResetSchema } from '@/schemas'
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
import { reset } from '@/actions/reset'

export default function ResetForm() {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: '' }
  })

  const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      reset(values)
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
      headerLabel='¿Olvidaste tu contraseña?'
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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type='submit'
            disabled={isPending}
            className='w-full'
          >
            Enviar correo de recuperación
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
