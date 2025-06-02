import { NextResponse } from 'next/server'

import { prisma } from '@/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.user.count()
    ])

    return NextResponse.json({
      users,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
