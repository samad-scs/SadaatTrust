import { useMemo } from 'react'

import { HeartHandshakeIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useBeneficiary } from '../../context'

const FamilyInfoCard = () => {
  const { beneficiary } = useBeneficiary()

  const spouseAge = useMemo(() => {
    if (!beneficiary?.spouseAge) return ''

    const age = beneficiary?.spouseAge

    const yearsGap = new Date().getFullYear() - new Date(beneficiary?.createdAt).getFullYear()

    return age + yearsGap
  }, [beneficiary?.createdAt, beneficiary?.spouseAge])

  if (!beneficiary) return null

  return (
    <Card className='h-fit gap-3'>
      <CardHeader className='pb-0'>
        <CardTitle className='flex items-center space-x-2 text-base lg:text-lg font-medium'>
          <HeartHandshakeIcon className='size-5 lg:size-6 shrink-0' />
          <span>Family</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Marital Status</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.maritalStatus || '-'}</span>
        </div>

        {beneficiary.maritalStatus === 'married' && (
          <>
            <div className='flex justify-between items-center'>
              <span className='text-sm lg:text-base text-muted-foreground'>Spouse Name</span>
              <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary?.spouseName || '-'}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm lg:text-base text-muted-foreground'>Spouse Age</span>
              <span className='text-xs lg:text-sm font-medium uppercase'>{spouseAge || '-'}</span>
            </div>
            {!!beneficiary?.spouseOccupation && (
              <div className='flex justify-between items-center'>
                <span className='text-sm lg:text-base text-muted-foreground'>Spouse Occupation</span>
                <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary?.spouseOccupation || '-'}</span>
              </div>
            )}
            <div className='flex justify-between items-center'>
              <span className='text-sm lg:text-base text-muted-foreground'>Dependent Children</span>
              <span className='text-xs lg:text-sm font-medium uppercase'>
                {beneficiary.numberOfDependentChildren || '0'}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm lg:text-base text-muted-foreground'>Independent Children</span>
              <span className='text-xs lg:text-sm font-medium uppercase'>
                {beneficiary.numberOfIndependentChildren || '0'}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default FamilyInfoCard
