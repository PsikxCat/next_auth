import { getCurrentUser } from '@/lib/auth'
import { UserInfo } from '../_components'

export default async function ServerPage() {
  const user = await getCurrentUser()

  return (
    <div className='text-white'>
      <UserInfo user={user} label='💻 Server Component' />
    </div>
  )
}
