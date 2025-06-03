import { prisma } from '@/prisma'

import { apiResponse } from '@utils/index'

type ParamsType = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: ParamsType) {
  const { id } = await params

  const decodedID = decodeURIComponent(id)

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  const checkUserExists = await prisma.user.findFirst({
    where: {
      OR: [{ id: decodedID }, { email: decodedID }]
    }
  })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  return apiResponse(true, 200, 'User found successfully!', checkUserExists)
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

export async function PATCH(request: Request, { params }: ParamsType) {
  const { id } = await params
  const body = await request.json()

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  if (!body) return apiResponse(false, 400, 'Invalid values provided!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  await prisma.user?.update({ where: { id: id }, data: { status: !!body?.status } })

  return apiResponse(true, 200, 'User status updated successfully!', null)
}

export async function DELETE(request: Request, { params }: ParamsType) {
  const { id } = await params

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  await prisma.user?.update({ where: { id: id }, data: { isDeleted: true } })

  return apiResponse(true, 201, 'User deleted successfully!', null)
}
