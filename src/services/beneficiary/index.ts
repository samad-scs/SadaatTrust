'use server'

import { prisma } from '@/prisma'
import { Beneficiary } from '@prisma/client'

import { BeneficiaryFormValues } from '@/views/beneficiary/form.schema'

import { serverActionResponse } from '@utils/index'

export const fetchBeneficiaryList = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const [users, total] = await Promise.all([
      prisma.beneficiary.findMany({
        skip: (page - 1) * pageSize,
        where: {
          dependencyStatus: 'independent',
          isDeleted: { not: true }
        },
        orderBy: { createdAt: 'desc' },
        take: pageSize
      }),
      prisma.beneficiary.count({
        where: {
          dependencyStatus: 'independent',
          isDeleted: { not: true }
        }
      })
    ])

    return {
      users,
      totalPages: Math.ceil(total / pageSize)
    }
  } catch {
    return null
  }
}

export const addBeneficiary = async (body: BeneficiaryFormValues) => {
  try {
    let dependentChildrenArray: BeneficiaryFormValues['dependentChildren'] = []

    if (body?.dependentChildren && body?.dependentChildren?.length > 0) {
      dependentChildrenArray = [...body?.dependentChildren]
    }

    const data = { ...body }

    delete data.dependentChildren

    const created = await prisma.beneficiary.create({
      data: {
        ...data,
        dependencyStatus: 'independent',
        age: +data?.age,
        spouseAge: +data?.age,
        numberOfDependentChildren: +(data?.numberOfDependentChildren || 0),
        numberOfIndependentChildren: +(data?.numberOfIndependentChildren || 0)
      }
    })

    for (let i = 0; i < dependentChildrenArray.length; i++) {
      const child = dependentChildrenArray[i]

      await prisma.beneficiary.create({
        data: {
          parentId: created?.id,
          dependencyStatus: 'dependent',
          address: created?.address,
          mobile: created?.mobile,
          name: child?.name,
          age: +child?.age,
          gender: child?.gender,
          maritalStatus: child?.maritalStatus,
          educationStatus: child?.educationStatus,
          employmentStatus: child?.employmentStatus,
          employmentType: child?.employmentType,
          monthlyIncome: child?.monthlyIncome
        }
      })
    }

    return true
  } catch (error) {
    console.log('error', error)

    return null
  }
}

export const deleteBeneficiary = async (id: string) => {
  try {
    if (!id) return serverActionResponse(false, 'Could not find such user!', null)

    const checkUserExists = await prisma.beneficiary.findUnique({ where: { id: id } })

    if (!checkUserExists) return serverActionResponse(false, 'Could not find such user!', null)

    await prisma.beneficiary?.update({ where: { id: id }, data: { isDeleted: true } })

    return serverActionResponse(true, 'Beneficiary deleted successfully!', null)
  } catch (error) {
    console.log('error delete', error)

    return serverActionResponse(false, 'Failed to delete a user!', null)
  }
}

export const fetchBeneficiaryById = async (id: string) => {
  try {
    if (!id) return null

    const beneficiary = await prisma.beneficiary.findUnique({
      where: {
        id: id,
        isDeleted: { not: true }
      }
    })

    if (!beneficiary) return null

    // If this is an independent beneficiary, fetch their dependent children
    let dependentChildren: Beneficiary[] = []

    if (beneficiary.dependencyStatus === 'independent') {
      dependentChildren = await prisma.beneficiary.findMany({
        where: {
          parentId: id,
          dependencyStatus: 'dependent',
          isDeleted: { not: true }
        },
        orderBy: { age: 'asc' }
      })
    }

    return {
      beneficiary,
      dependentChildren
    }
  } catch (error) {
    console.log('error fetchBeneficiaryById', error)

    return null
  }
}
