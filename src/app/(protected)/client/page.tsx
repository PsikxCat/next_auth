'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { UserInfo } from '../_components'

export default function ServerPage() {
  const user = useCurrentUser()

  return (
    <div className='text-white'>
      <UserInfo user={user} label='📱 Client Component' />
    </div>
  )
}
