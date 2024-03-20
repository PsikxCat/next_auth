'use client'

import type * as z from 'zod'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { settings } from '@/actions/settings'
import { SettingsSchema } from '@/schemas'
import { FormError, FormSuccess } from '@/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function SettingsPage() {
  const user = useCurrentUser()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? undefined,
      email: user?.email ?? undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role ?? undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? undefined
    }
  })

  const handleSubmit = (values: z.infer<typeof SettingsSchema>) => {
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

      {/* formulario */}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* campos del formulario */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='Jhon Doe'
                        type='text'
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* campos visibles solo para credentials provider */}
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type='email'
                            placeholder='your@email.com'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type='password'
                            placeholder='******'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type='password'
                            placeholder='******'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isTwoFactorEnabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className='space-y-0.5'>
                          <FormLabel>Two Factor Authentication</FormLabel>
                          <FormDescription>Activar la autenticacion 2FA para tu cuenta.</FormDescription>
                        </div>

                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>

                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un rol'/>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>
                          Admin
                        </SelectItem>

                        <SelectItem value={UserRole.USER}>
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* mensajes */}
            {error && <FormError message={error}/>}
            {success && <FormSuccess message={success}/>}

            {/* botón */}
            <Button type='submit' disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
