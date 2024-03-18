import { type UserRole } from '@prisma/client'

import useCurrentRole from '@/hooks/use-current-role'
import { FormError } from '@/components'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

export default function RoleGate({ children, allowedRole }: RoleGateProps) {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <FormError message='You are not authorized to view this content.' />
    )
  }

  return (
    <>{children}</>
  )
}
