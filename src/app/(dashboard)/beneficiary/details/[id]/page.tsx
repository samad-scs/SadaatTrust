import React from 'react'

import { routes } from '@/constants/route'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

import BeneficiaryView from '@/views/beneficiary/view'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const getParams = await params

  return (
    <>
      <BreadcrumbComponent
        data={[
          { path: routes.beneficiary, title: 'Beneficiaries' },
          { path: routes.beneficiaryDetails + getParams.id, title: 'Details' }
        ]}
      />

      <BeneficiaryView />
    </>
  )
}

export default Page
