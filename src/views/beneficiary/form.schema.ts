import z from 'zod'

import { pattern } from '@/constants/patterns'

const genderEnum = z.enum(['male', 'female', 'other'])

const maritalStatusEnum = z.enum(['married', 'single', 'widowed', 'divorced', 'separated'])

const healthConditionEnum = z.enum(['poor', 'fair', 'good', 'excellent'])

const educationLevelEnum = z.enum([
  'noEducation',
  'primary',
  'secondary',
  'higher',
  'graduate',
  'postgraduate',
  'doctorate'
])

const educationStatusEnum = z.enum(['studying', 'completed', 'dropped'])

const employmentStatusEnum = z.enum(['employed', 'unemployed', 'part-time', 'homemaker', 'student', 'retired'])

const employmentTypeEnum = z
  .enum(['agriculture', 'government', 'private', 'self-employed', 'daily-wage', 'shop'])
  .optional()

const housingStatusEnum = z.enum(['owned', 'rented', 'family'])

export const beneficiaryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .regex(pattern.alphaAllowed, { message: 'Name can only contain alphabets' }),

  age: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 15 && Number(val) <= 120, {
    message: 'Age must be between 15 and 120'
  }),

  gender: genderEnum,
  mobile: z.string(),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),

  // Education
  educationLevel: educationLevelEnum,
  educationStatus: educationStatusEnum,
  institution: z.string().optional(),
  droppedReason: z.string().optional(),

  // Employment
  employmentStatus: employmentStatusEnum,
  employmentType: employmentTypeEnum,
  occupation: z.string().optional(),
  monthlyIncome: z.string().optional(),

  // Adult fields (18+)
  maritalStatus: maritalStatusEnum.optional(),

  // Family Information (if married)
  spouseName: z.string().optional(),
  spouseAge: z.string().optional(),
  spouseOccupation: z.string().optional(),
  numberOfDependentChildren: z.string().optional(),
  numberOfIndependentChildren: z.string().optional(),
  dependentChildren: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().regex(pattern.alphaAllowed, { message: 'Name can only contain alphabets' }),
        age: z.string(),
        gender: genderEnum,
        maritalStatus: maritalStatusEnum.optional(),
        educationStatus: educationStatusEnum,
        extraClasses: z.string().optional(),
        educationExpense: z.string().optional(),
        lastResultPercentage: z.string().optional(),
        droppedReason: z.string().optional(),
        employmentStatus: employmentStatusEnum,
        employmentType: employmentTypeEnum,
        monthlyIncome: z.string().optional()
      })
    )
    .optional(),

  // Economic Status
  familyIncome: z.string().optional(),
  earningMembers: z.string().optional(),
  primaryIncomeSource: z.string().optional(),
  housingStatus: housingStatusEnum.optional(),
  monthlyRent: z.string().optional(),
  assets: z.array(z.string()).optional(),

  // Health Information
  healthCondition: healthConditionEnum,
  chronicIllnesses: z.string().optional(),
  medication: z.string().optional(),
  healthInsurance: z.enum(['yes', 'no']).optional(),
  insuranceType: z.string().optional(),
  disability: z.enum(['yes', 'no']).optional(),
  disabilityType: z.string().optional(),
  medicalExpenses: z.string().optional(),

  rationCardType: z.string().optional(),
  governmentSchemes: z.array(z.string()).optional(),

  // Assistance Needs
  assistanceNeeds: z.array(z.string()).optional(),
  priorityLevel: z.string().optional(),

  // Comments
  comments: z.string().optional()
})

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>

export const handleUpperCaseChange =
  // eslint-disable-next-line no-unused-vars
  (onChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase())
  }
