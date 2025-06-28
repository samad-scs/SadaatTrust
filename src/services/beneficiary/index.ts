'use server'

import { prisma } from '@/prisma'

import { BeneficiaryFormValues } from '@/views/beneficiary/form.schema'

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
