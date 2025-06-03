import { NextResponse } from 'next/server'

import { prisma } from '@/prisma'

import { apiResponse } from '@utils/index'

type ParamsType = { params: Promise<{ id: string }> }

export async function GET(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function PUT(request: Request, { params }: ParamsType) {
  const { id } = await params
  const body = await request.json()

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)
  if (!body) return apiResponse(false, 400, 'Invalid values provided!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  await prisma.user?.update({ where: { id: id }, data: body })

  return apiResponse(true, 200, 'User updated successfully!', null)
}

export async function DELETE(request: Request, { params }: ParamsType) {
  const { id } = await params

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  await prisma.user?.update({ where: { id: id }, data: { isDeleted: true } })

  return apiResponse(true, 201, 'User deleted successfully!', null)
}
