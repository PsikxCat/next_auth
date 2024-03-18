'use client'

import { UserRole } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RoleGate } from '../_components'
import { FormSuccess } from '@/components'
import { Button } from '@/components/ui/button'
import { admin } from '@/actions/admin'
import { toast } from 'sonner'

export default function AdminPage() {
  const onApiRouteClick = () => {
    fetch('/api/admin')
      .then((res) => {
        if (res.ok) toast.success('API call successful')
        else toast.error('API call failed')
      }).catch((error) => {
        console.error('Error en la llamada a la API', error)
      })
  }

  const onServerActionClick = () => {
    admin()
      .then((res) => {
        if (res.success) toast.success('Server action successful')
        else toast.error('Server action failed')
      }).catch((error) => {
        console.error('Error en la llamada al server', error)
      })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          🔑 Admin Page
        </p>
      </CardHeader>

      <CardContent className='space-y-4'>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess
            message='You are authorized to view this content.'
          />
        </RoleGate>

        {/* llamado a API */}
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>
            Admin-only API Route
          </p>

          <Button onClick={onApiRouteClick}>
            Click to test
          </Button>
        </div>

        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>
            Admin-only Server Action
          </p>

          <Button onClick={onServerActionClick}>
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
