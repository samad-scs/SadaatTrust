import { NextResponse } from 'next/server'

import { prisma } from '@/prisma'

import { apiResponse } from '@utils/index'

export async function GET(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function PUT(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  await prisma.user?.update({ where: { id: id }, data: { isDeleted: true } })

  return apiResponse(true, 201, 'User deleted successfully!', null)
}
