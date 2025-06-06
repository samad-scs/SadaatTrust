import { prisma } from '@/prisma'
import * as bcrypt from 'bcrypt-ts'

import { apiResponse } from '@utils/index'

type ParamsType = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: ParamsType) {
  const { id } = await params
  const { password } = await request.json()

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  if (!password) return apiResponse(false, 400, 'Invalid values provided!', null)

  const checkUserExists = await prisma.user.findUnique({ where: { id: id } })

  if (!checkUserExists) return apiResponse(false, 404, 'Could not find such user!', null)

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user?.update({
    where: { id: id },
    data: { password: hashedPassword }
  })

  return apiResponse(true, 200, 'User updated successfully!', null)
}
