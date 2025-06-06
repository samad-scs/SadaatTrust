import React from 'react'

import { routes } from '@/constants/route'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

import BeneficiaryList from '@/views/beneficiary/list'

const Page = () => {
  return (
    <>
      <BreadcrumbComponent data={[{ path: routes.users, title: 'Beneficiaries' }]} />
      <BeneficiaryList />
    </>
  )
}

export default Page
