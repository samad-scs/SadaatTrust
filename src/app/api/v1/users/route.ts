import { NextResponse } from 'next/server'

import { prisma } from '@/prisma'
import * as bcrypt from 'bcrypt-ts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        where: {
          isSuperAdmin: false,
          isDeleted: { not: true }
        },
        orderBy: { createdAt: 'desc' },
        take: pageSize
      }),
      prisma.user.count({
        where: {
          isSuperAdmin: false,
          isDeleted: { not: true }
        }
      })
    ])

    return NextResponse.json({
      users,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const checkEmailExist = await prisma.user.findUnique({ where: { email: body?.email } })

    if (checkEmailExist)
      return NextResponse.json({ message: 'Email already exists!', status: false, data: null }, { status: 406 })

    const { password }: { password: string } = body

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const createUser = await prisma.user.create({ data: { ...body, password: hashedPassword } })

    return NextResponse.json(
      {
        status: true,
        data: createUser,
        message: 'User created successfully!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('error :', error)
  }
}
