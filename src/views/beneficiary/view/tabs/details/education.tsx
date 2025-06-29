import { GraduationCap } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useBeneficiary } from '../../context'

const EducationCard = () => {
  const { beneficiary } = useBeneficiary()

  if (!beneficiary) return null

  return (
    <Card className='h-fit gap-3'>
      <CardHeader className='pb-0'>
        <CardTitle className='flex items-center space-x-2 text-base lg:text-lg font-medium'>
          <GraduationCap className='size-5 lg:size-6 shrink-0' />
          <span>Education</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Level</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.educationLevel || '-'}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Status</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.educationStatus || '-'}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base text-muted-foreground'>Dependency</span>
          <span className='text-xs lg:text-sm font-medium uppercase'>{beneficiary.dependencyStatus || '-'}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default EducationCard
