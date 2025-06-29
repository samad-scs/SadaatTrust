import { Briefcase } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useBeneficiary } from '../../context'

const EmploymentCard = () => {
  const { beneficiary } = useBeneficiary()

  if (!beneficiary) return null

  return (
    <Card className='h-fit gap-3'>
      <CardHeader className='pb-0'>
        <CardTitle className='flex items-center space-x-2 text-base lg:text-lg font-medium'>
          <Briefcase className='size-5 lg:size-6 shrink-0' />
          <span>Employment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Status</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.employmentStatus || '-'}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Type</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.employmentType || '-'}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Occupation</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.occupation || '-'}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmploymentCard
