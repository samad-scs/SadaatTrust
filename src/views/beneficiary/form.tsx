'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

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
  id: uuidv4(),
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
  healthInsurance: '',
  insuranceType: '',
  disability: '',
  disabilityType: '',
  medicalExpenses: '',
  rationCardType: 'none',
  governmentSchemes: [],
  assistanceNeeds: [],
  priorityLevel: '',
  comments: ''
}

export default function PersonForm() {
  const t = useTranslations()
  const router = useRouter()
  const [showAlert] = useState<string | null>(null)

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

  function onSubmit(data: BeneficiaryFormValues) {
    // Check for validation issues
    if (showAlert === 'marriedEmployedDependent') {
      toast('Please resolve the validation issues before saving')
    }

    console.log('Form submitted:', data)
    toast('Person Saved')
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
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
