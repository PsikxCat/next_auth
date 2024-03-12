'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { FaUser } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'

import { LogoutButton } from '@/components'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'

export default function UserButton() {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ''} alt="avatar" />

          <AvatarFallback className='bg_blue_gradient'>
            <FaUser className='text-white' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-40' align='end'>
        <LogoutButton>
          <DropdownMenuItem>
            <ImExit className='mr-2' />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
