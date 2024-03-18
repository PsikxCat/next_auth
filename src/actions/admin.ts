'use server'

import { getCurrentRole } from '@/lib/auth'

export const admin = async () => {
  const role = await getCurrentRole()

  if (role !== 'ADMIN') return { error: 'Unauthorized', status: 401 }

  return { success: 'Allowed', status: 200 }
}
