import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { getCurrentRole } from '@/lib/auth'

export async function GET() {
  const role = await getCurrentRole()

  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}
