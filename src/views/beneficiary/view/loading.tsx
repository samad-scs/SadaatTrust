import React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const BeneficiaryLoadingSkeleton = () => {
  return (
    <div className='space-y-6 m-4'>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className='h-4 w-20 mb-2' />
                <Skeleton className='h-6 w-32' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-40' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-6 w-28' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BeneficiaryLoadingSkeleton
