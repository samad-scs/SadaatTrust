'use client'

import { useForm } from 'react-hook-form'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { addBeneficiary } from '@/services/beneficiary'

import AdditionalComment from './form-components/additional-comments'
import AdultInformation from './form-components/adult-information'
import AssistanceNeeds from './form-components/assistance-needs'
import BasicInformation from './form-components/basic-information'
import EconomicInformation from './form-components/economic-information'
import EducationInformation from './form-components/education-information'
import EmployementSection from './form-components/employement-section'
import FamilyInformation from './form-components/family-information'
import GovernmentBenifits from './form-components/government-benifits'
import HealthInformation from './form-components/health-information'
import { BeneficiaryFormValues, beneficiaryFormSchema } from './form.schema'

const defaultValues: BeneficiaryFormValues = {
  name: '',
  age: '',
  gender: 'male',
  mobile: '',
  address: '',
  maritalStatus: 'married',
  educationLevel: 'primary',
  educationStatus: 'completed',
  institution: '',
  employmentStatus: 'employed',
  employmentType: undefined,
  occupation: '',
  monthlyIncome: '',
  spouseName: '',
  spouseAge: '',
  spouseOccupation: '',
  numberOfDependentChildren: '0',
  numberOfIndependentChildren: '0',
  dependentChildren: [],
  familyIncome: '',
  earningMembers: '',
  primaryIncomeSource: '',
  housingStatus: 'owned',
  monthlyRent: '',
  assets: [],
  healthCondition: 'good',
  chronicIllnesses: '',
  medication: '',
  healthInsurance: undefined,
  insuranceType: '',
  disability: undefined,
  disabilityType: '',
  medicalExpenses: '0',
  rationCardType: 'none',
  governmentSchemes: [],
  assistanceNeeds: [],
  priorityLevel: '',
  comments: ''
}

export default function PersonForm() {
  const t = useTranslations()
  const router = useRouter()

  const { data: userData } = useSession()

  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiaryFormSchema),
    defaultValues
  })

  // Watch key fields for conditional logic
  const age = Number(form.watch('age')) || 0
  const maritalStatus = form.watch('maritalStatus')
  const employmentStatus = form.watch('employmentStatus')
  const educationStatus = form.watch('educationStatus')

  // Age-based logic
  const isChild = age < 18
  const isMarried = maritalStatus === 'married'
  const isEmployed = employmentStatus === 'employed'
  const isStudent = employmentStatus === 'student' || educationStatus === 'studying'

  const { isSubmitting } = form?.formState

  async function onSubmit(data: BeneficiaryFormValues) {
    console.log('userData', userData?.user?.id)
    if (!(userData as any)?.user?.id) return toast.error('Invalid Login Info.')

    try {
      const response = await addBeneficiary({ ...data, createdBy: (userData as any)?.user?.id as string })

      if (!!response) {
        toast.success('Beneficiary Added Successfully')
        router?.back()
      }
    } catch (error) {
      console.error('error: onSubmit', error)
    }
  }

  return (
    <div className='space-y-6 m-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Basic Information - Always Shown */}
          <BasicInformation />

          {/* Adult Information (18+) */}
          {!isChild && <AdultInformation />}

          {/* Education Section */}
          <EducationInformation />

          {/* Employment Section - Only for adults who are not students */}
          {!isChild && !isStudent && <EmployementSection />}

          {/* Family Information - Only for married adults */}
          {isMarried && <FamilyInformation />}

          {/* Economic Status - For adults with families or earning members */}
          {!isChild && (isMarried || isEmployed) && <EconomicInformation />}

          {/* Health Information - For adults */}
          {!isChild && <HealthInformation />}

          {/* Government Benefits */}
          <GovernmentBenifits />

          {/* Assistance Needs */}
          <AssistanceNeeds />

          {/* Additional Comments */}
          <AdditionalComment />

          {/* Form Actions */}
          <div className='flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between'>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              <ChevronLeft className='h-4 w-4 mr-2' />

              {'Go Back'}
            </Button>

            <Button type='submit' className=''>
              {isSubmitting ? 'Saving...' : t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
