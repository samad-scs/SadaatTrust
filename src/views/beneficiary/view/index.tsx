'use client'

import { IconHealthRecognition, IconMoneybag, IconNote } from '@tabler/icons-react'
import { AlertCircle, UserIcon } from 'lucide-react'

import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/components/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { BeneficiaryProvider, useBeneficiaryBasic, useBeneficiaryData } from './context'
import BeneficiaryLoadingSkeleton from './loading'
import BeneficiaryHeader from './profile-header'
import BeneficiaryAssessmentTab from './tabs/assesment'
import BeneficiaryDetailsTab from './tabs/details'
import BeneficiaryFinancialTab from './tabs/financial'
import BeneficiaryHealthTab from './tabs/health'

// Main component that wraps the provider
const BeneficiaryViewWrapper = () => {
  return (
    <BeneficiaryProvider>
      <BeneficiaryViewContent />
    </BeneficiaryProvider>
  )
}

// Content component that uses the context
const BeneficiaryViewContent = () => {
  const { beneficiary, isLoading, isError } = useBeneficiaryBasic()
  const { error } = useBeneficiaryData()

  if (isLoading) {
    return <BeneficiaryLoadingSkeleton />
  }

  if (isError) {
    return (
      <Alert variant='destructive' className='m-4'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Failed to load beneficiary data: {error?.message || 'Unknown error'}</AlertDescription>
      </Alert>
    )
  }

  if (!beneficiary) {
    return (
      <Alert className='m-4'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>No beneficiary found with the provided ID.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-6 m-4'>
      <BeneficiaryHeader />

      {/* Tabbed Content */}
      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='grid w-full !grid-cols-4 flex-nowrap'>
          <TabsTrigger value='details'>
            <UserIcon className='lg:hidden size-5' />
            <p className='hidden lg:block'>Personal Details</p>
          </TabsTrigger>
          <TabsTrigger value='financial'>
            <IconMoneybag className='lg:hidden size-5' />
            <p className='hidden lg:block'>Financial Info</p>
          </TabsTrigger>
          <TabsTrigger value='health'>
            <IconHealthRecognition className='lg:hidden size-5' />
            <p className='hidden lg:block'>Health & Welfare</p>
          </TabsTrigger>
          <TabsTrigger value='assessment'>
            <IconNote className='lg:hidden size-5' />
            <p className='hidden lg:block'>Assesment</p>
          </TabsTrigger>
        </TabsList>

        <TabsContents className='mx-1 mb-1 -mt-2 rounded-sm h-full bg-background'>
          <TabsContent value='details' className='space-y-6 pt-6'>
            <BeneficiaryDetailsTab />
          </TabsContent>
          <TabsContent value='financial' className='space-y-6 pt-6'>
            <BeneficiaryFinancialTab />
          </TabsContent>
          <TabsContent value='health' className='space-y-6 pt-6'>
            <BeneficiaryHealthTab />
          </TabsContent>
          <TabsContent value='assessment' className='space-y-6 pt-6'>
            <BeneficiaryAssessmentTab />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default BeneficiaryViewWrapper
