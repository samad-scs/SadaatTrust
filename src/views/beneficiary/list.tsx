import React from 'react'

import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { routes } from '@/constants/route'

import { Button } from '@/components/ui/button'

const BeneficiaryList = () => {
  return (
    <div className='space-y-3 m-4'>
      <div className='flex justify-between items-center'>
        <div />
        <div>
          <Link href={routes.beneficiaryCreate}>
            <Button>
              <PlusIcon />
              Add Beneficiary
            </Button>
          </Link>
        </div>
      </div>
      <div className='rounded-lg overflow-hidden border border-muted'>LIST WILL BE HERE</div>
    </div>
  )
}

export default BeneficiaryList
