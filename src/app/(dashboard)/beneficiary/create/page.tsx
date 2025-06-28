import React from 'react'

import { routes } from '@/constants/route'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

import PersonForm from '@/views/beneficiary/form'

const CreatePage = () => {
  return (
    <>
      <BreadcrumbComponent
        data={[
          { path: routes.beneficiary, title: 'Beneficiaries' },
          { path: routes.beneficiaryCreate, title: 'Create' }
        ]}
      />
      <PersonForm />
    </>
  )
}

export default CreatePage
