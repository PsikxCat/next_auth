'use client'

import type * as z from 'zod'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useCurrentUser } from '@/hooks/use-current-user'
import { settings } from '@/actions/settings'
import { SettingsSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  const user = useCurrentUser()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? undefined
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then(async (data) => {
          if (data.error) setError(data.error)

          if (data.success) {
            setSuccess(data.success)
            await update()
          }
        })
        .catch(() => { setError('An error occurred') })
    })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          🔧 Settings
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormControl>
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Jhon Doe'
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  </FormControl>
                )}
              />
            </div>

            <Button type='submit' disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
