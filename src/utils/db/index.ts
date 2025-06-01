import { prisma } from '@/prisma'

export const getUserFromDb = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })

  return user
}
