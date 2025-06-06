'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, ChevronLeft, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const personFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  age: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 15 && Number(val) <= 120, {
    message: 'Age must be between 15 and 120'
  }),
  gender: z.string(),
  mobile: z.string().optional(),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),

  // Education
  educationLevel: z.string(),
  educationStatus: z.string().optional(),
  institution: z.string().optional(),

  // Employment
  employmentStatus: z.string(),
  employmentType: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.string().optional(),

  // Adult fields (18+)
  maritalStatus: z.string().optional(),

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
        name: z.string(),
        age: z.string(),
        gender: z.string(),
        maritalStatus: z.string().optional(),
        educationStatus: z.string().optional(),
        extraClasses: z.string().optional(),
        monthlyExpense: z.string().optional(),
        lastResultPercentage: z.string().optional(),
        whyNotStudying: z.string().optional(),
        employmentStatus: z.string().optional(),
        workType: z.string().optional(),
        monthlyIncome: z.string().optional()
      })
    )
    .optional(),

  // Economic Status
  familyIncome: z.string().optional(),
  earningMembers: z.string().optional(),
  primaryIncomeSource: z.string().optional(),
  housingStatus: z.string().optional(),
  monthlyRent: z.string().optional(),
  assets: z.array(z.string()).optional(),

  // Health Information
  healthCondition: z.string().optional(),
  chronicIllnesses: z.string().optional(),
  medication: z.string().optional(),
  healthInsurance: z.string().optional(),
  insuranceType: z.string().optional(),
  disability: z.string().optional(),
  disabilityType: z.string().optional(),
  medicalExpenses: z.string().optional(),

  // Government Benefits
  bplCard: z.string().optional(),
  rationCardType: z.string().optional(),
  governmentSchemes: z.array(z.string()).optional(),

  // Assistance Needs
  assistanceNeeds: z.array(z.string()).optional(),
  priorityLevel: z.string().optional(),

  // Comments
  comments: z.string().optional()
})

const defaultValues = {
  id: uuidv4(),
  name: '',
  age: '',
  gender: '',
  mobile: '',
  address: '',
  maritalStatus: '',
  educationLevel: '',
  educationStatus: '',
  institution: '',
  employmentStatus: '',
  employmentType: '',
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
  housingStatus: '',
  monthlyRent: '',
  assets: [],
  healthCondition: '',
  chronicIllnesses: '',
  medication: '',
  healthInsurance: '',
  insuranceType: '',
  disability: '',
  disabilityType: '',
  medicalExpenses: '',
  bplCard: '',
  rationCardType: '',
  governmentSchemes: [],
  assistanceNeeds: [],
  priorityLevel: '',
  comments: ''
}

type PersonFormValues = z.infer<typeof personFormSchema>

export default function PersonForm() {
  const t = useTranslations()
  const router = useRouter()
  const [savedPersons, setSavedPersons] = useState<PersonFormValues[]>([])
  const [showAlert] = useState<string | null>(null)

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues
  })

  const {
    fields: dependentChildrenFields,
    append: appendDependentChild,
    remove: removeDependentChild
  } = useFieldArray({
    control: form.control,
    name: 'dependentChildren'
  })

  // Watch key fields for conditional logic
  const age = Number(form.watch('age')) || 0
  const maritalStatus = form.watch('maritalStatus')
  const employmentStatus = form.watch('employmentStatus')
  const educationStatus = form.watch('educationStatus')
  const healthInsurance = form.watch('healthInsurance')
  const disability = form.watch('disability')
  const bplCard = form.watch('bplCard')
  const numberOfDependentChildren = Number(form.watch('numberOfDependentChildren')) || 0

  // Age-based logic
  const isChild = age < 18
  const isAdult = age >= 18 && age < 50
  const isElderly = age >= 50
  const isMarried = maritalStatus === 'Married'
  const isEmployed = employmentStatus === 'Employed'
  const isStudent = employmentStatus === 'Student' || educationStatus === 'Currently Studying'

  function onSubmit(data: PersonFormValues) {
    // Check for validation issues
    if (showAlert === 'marriedEmployedDependent') {
      toast('Please resolve the validation issues before saving')
    }

    console.log('Form submitted:', data)
    setSavedPersons([...savedPersons, data])
    toast('Person Saved')
  }

  function resetForm() {
    form.reset(defaultValues)
  }

  const handleDependentChildrenChange = (value: string) => {
    const numChildren = Number.parseInt(value) || 0
    form.setValue('numberOfDependentChildren', value)

    if (numChildren > 0) {
      const currentChildren = form.getValues('dependentChildren') || []
      if (numChildren > currentChildren.length) {
        for (let i = currentChildren.length; i < numChildren; i++) {
          appendDependentChild({
            id: uuidv4(),
            name: '',
            age: '',
            gender: '',
            maritalStatus: '',
            educationStatus: '',
            extraClasses: '',
            monthlyExpense: '',
            lastResultPercentage: '',
            whyNotStudying: '',
            employmentStatus: '',
            workType: '',
            monthlyIncome: ''
          })
        }
      } else if (numChildren < currentChildren.length) {
        for (let i = currentChildren.length - 1; i >= numChildren; i--) {
          removeDependentChild(i)
        }
      }
    } else {
      form.setValue('dependentChildren', [])
    }
  }

  return (
    <div className='space-y-6 m-4'>
      {/* Saved Persons Summary */}
      {savedPersons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Persons ({savedPersons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-2'>
              {savedPersons.map((person, index) => (
                <div key={person.id} className='flex justify-between items-center p-2 bg-muted rounded'>
                  <span>
                    {index + 1}. {person.name} (Age: {person.age})
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    {isChild ? 'Child' : isAdult ? 'Adult' : 'Senior'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Basic Information - Always Shown */}
          <Card>
            <CardHeader>
              <CardTitle>{t('basic.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('basic.name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='age'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('basic.age')}</FormLabel>
                      <FormControl>
                        <Input type='number' min='1' max='120' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('basic.gender')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('common.select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Male'>{t('basic.male')}</SelectItem>
                          <SelectItem value='Female'>{t('basic.female')}</SelectItem>
                          <SelectItem value='Other'>{t('basic.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='mobile'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('basic.mobile')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>{t('basic.address')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Adult Information (18+) */}
          {!isChild && (
            <Card>
              <CardHeader>
                <CardTitle>{isElderly ? t('elderly.title') : t('adult.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='maritalStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adult.maritalStatus')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Single'>{t('adult.single')}</SelectItem>
                            <SelectItem value='Married'>{t('adult.married')}</SelectItem>
                            <SelectItem value='Divorced'>{t('adult.divorced')}</SelectItem>
                            <SelectItem value='Widowed'>{t('adult.widowed')}</SelectItem>
                            <SelectItem value='Separated'>{t('adult.separated')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Health condition for elderly */}
                  {isElderly && (
                    <>
                      <FormField
                        control={form.control}
                        name='healthCondition'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('elderly.health')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder={t('common.select')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Excellent'>{t('elderly.excellent')}</SelectItem>
                                <SelectItem value='Good'>{t('elderly.good')}</SelectItem>
                                <SelectItem value='Fair'>{t('elderly.fair')}</SelectItem>
                                <SelectItem value='Poor'>{t('elderly.poor')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='chronicIllnesses'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('elderly.chronic')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='medication'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('elderly.medication')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('education.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='educationLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('education.level')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('common.select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='No Formal Education'>{t('education.noEducation')}</SelectItem>
                          <SelectItem value='Primary'>{t('education.primary')}</SelectItem>
                          <SelectItem value='Middle'>{t('education.middle')}</SelectItem>
                          <SelectItem value='Secondary'>{t('education.secondary')}</SelectItem>
                          <SelectItem value='Higher Secondary'>{t('education.higherSecondary')}</SelectItem>
                          <SelectItem value='Graduate'>{t('education.graduate')}</SelectItem>
                          <SelectItem value='Post Graduate'>{t('education.postGraduate')}</SelectItem>
                          <SelectItem value='Doctorate'>{t('education.doctorate')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isChild && (
                  <FormField
                    control={form.control}
                    name='educationStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('education.status')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Currently Studying'>{t('education.studying')}</SelectItem>
                            <SelectItem value='Education Completed'>{t('education.completed')}</SelectItem>
                            <SelectItem value='Dropped Out'>{t('education.dropped')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {educationStatus === 'Currently Studying' && (
                  <FormField
                    control={form.control}
                    name='institution'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('education.institution')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment Section - Only for adults who are not students */}
          {!isChild && !isStudent && (
            <Card>
              <CardHeader>
                <CardTitle>{t('employment.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='employmentStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employment.status')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Employed'>{t('employment.employed')}</SelectItem>
                            <SelectItem value='Unemployed'>{t('employment.unemployed')}</SelectItem>
                            <SelectItem value='Student'>{t('employment.student')}</SelectItem>
                            <SelectItem value='Homemaker'>{t('employment.homemaker')}</SelectItem>
                            <SelectItem value='Retired'>{t('employment.retired')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEmployed && (
                    <>
                      <FormField
                        control={form.control}
                        name='employmentType'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('employment.type')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder={t('common.select')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Government'>{t('employment.government')}</SelectItem>
                                <SelectItem value='Private'>{t('employment.private')}</SelectItem>
                                <SelectItem value='Self-Employed'>{t('employment.selfEmployed')}</SelectItem>
                                <SelectItem value='Daily Wage'>{t('employment.daily')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='occupation'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('employment.occupation')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='monthlyIncome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('employment.income')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder={t('common.select')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='0-10000'>{t('employment.income1')}</SelectItem>
                                <SelectItem value='10001-25000'>{t('employment.income2')}</SelectItem>
                                <SelectItem value='25001-50000'>{t('employment.income3')}</SelectItem>
                                <SelectItem value='50001-100000'>{t('employment.income4')}</SelectItem>
                                <SelectItem value='100000+'>{t('employment.income5')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Family Information - Only for married adults */}
          {isMarried && (
            <Card>
              <CardHeader>
                <CardTitle>{t('family.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='spouseName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('family.spouseName')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='spouseAge'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('family.spouseAge')}</FormLabel>
                          <FormControl>
                            <Input type='number' min='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='spouseOccupation'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('family.spouseOccupation')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='numberOfDependentChildren'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Dependent Children</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='0'
                              {...field}
                              onChange={e => handleDependentChildrenChange(e.target.value)}
                            />
                          </FormControl>
                          <FormDescription>Children who are financially dependent on you</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='numberOfIndependentChildren'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Independent Children</FormLabel>
                          <FormControl>
                            <Input type='number' min='0' {...field} />
                          </FormControl>
                          <FormDescription>Children who are financially independent</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Alert for validation issues */}
                  {showAlert && (
                    <Alert variant={showAlert === 'marriedEmployedDependent' ? 'destructive' : 'default'}>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>
                        {showAlert === 'marriedEmployedDependent'
                          ? 'Married dependent children must be unemployed. Please update their employment status.'
                          : 'Warning: This may need review.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {numberOfDependentChildren > 0 && (
                    <div className='space-y-4'>
                      {dependentChildrenFields.map((child, index) => {
                        // Watch child-specific fields for conditional logic
                        const childAge = Number(form.watch(`dependentChildren.${index}.age`)) || 0
                        const childMaritalStatus = form.watch(`dependentChildren.${index}.maritalStatus`)
                        const childEducationStatus = form.watch(`dependentChildren.${index}.educationStatus`)
                        const childEmploymentStatus = form.watch(`dependentChildren.${index}.employmentStatus`)

                        // Check for validation issues
                        const isChildOver15 = childAge >= 15
                        const isChildMarried = childMaritalStatus === 'Married'

                        const isChildEmployed =
                          childEmploymentStatus === 'Employed' ||
                          childEmploymentStatus === 'Part-time' ||
                          childEmploymentStatus === 'Self-employed'

                        return (
                          <Card key={child.id}>
                            <CardContent className='pt-6'>
                              <div className='grid gap-4 md:grid-cols-2'>
                                <FormField
                                  control={form.control}
                                  name={`dependentChildren.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`dependentChildren.${index}.age`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Age</FormLabel>
                                      <FormControl>
                                        <Input type='number' min='0' {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`dependentChildren.${index}.gender`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Gender</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={t('common.select')} />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value='Male'>{t('basic.male')}</SelectItem>
                                          <SelectItem value='Female'>{t('basic.female')}</SelectItem>
                                          <SelectItem value='Other'>{t('basic.other')}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Marital Status for children 15+ */}
                                {isChildOver15 && (
                                  <FormField
                                    control={form.control}
                                    name={`dependentChildren.${index}.maritalStatus`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Marital Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger className='w-full'>
                                              <SelectValue placeholder={t('common.select')} />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value='Single'>Single</SelectItem>
                                            <SelectItem value='Married'>Married</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                {/* Education Status */}
                                <FormField
                                  control={form.control}
                                  name={`dependentChildren.${index}.educationStatus`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Education Status</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={t('common.select')} />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value='Studying'>Currently Studying</SelectItem>
                                          <SelectItem value='Completed'>Education Completed</SelectItem>
                                          <SelectItem value='Dropped'>Dropped Out</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* If studying, show extra fields */}
                                {childEducationStatus === 'Studying' && (
                                  <>
                                    <FormField
                                      control={form.control}
                                      name={`dependentChildren.${index}.extraClasses`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Extra Classes</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={t('common.select')} />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value='Yes'>Yes</SelectItem>
                                              <SelectItem value='No'>No</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`dependentChildren.${index}.monthlyExpense`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Monthly Education Expense (₹)</FormLabel>
                                          <FormControl>
                                            <Input type='number' min='0' {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`dependentChildren.${index}.lastResultPercentage`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Last Result Percentage</FormLabel>
                                          <FormControl>
                                            <Input type='number' min='0' max='100' {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </>
                                )}

                                {/* If not studying, ask why */}
                                {childEducationStatus === 'Dropped' && (
                                  <FormField
                                    control={form.control}
                                    name={`dependentChildren.${index}.whyNotStudying`}
                                    render={({ field }) => (
                                      <FormItem className='md:col-span-2'>
                                        <FormLabel>Reason for Not Studying</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                {/* Employment Status for children 15+ */}
                                {isChildOver15 && (
                                  <>
                                    <FormField
                                      control={form.control}
                                      name={`dependentChildren.${index}.employmentStatus`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Employment Status</FormLabel>
                                          <Select
                                            onValueChange={value => {
                                              // Auto-set to unemployed if married
                                              if (isChildMarried && value !== 'Unemployed') {
                                                field.onChange('Unemployed')
                                              } else {
                                                field.onChange(value)
                                              }
                                            }}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={t('common.select')} />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value='Unemployed'>Unemployed</SelectItem>
                                              <SelectItem value='Employed' disabled={isChildMarried}>
                                                Employed
                                              </SelectItem>
                                              <SelectItem value='Part-time' disabled={isChildMarried}>
                                                Part-time
                                              </SelectItem>
                                              <SelectItem value='Self-employed' disabled={isChildMarried}>
                                                Self-employed
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          {isChildMarried && (
                                            <FormDescription className='text-red-500'>
                                              Married dependent children must be unemployed
                                            </FormDescription>
                                          )}
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    {/* If employed, show work details */}
                                    {isChildEmployed && !isChildMarried && (
                                      <>
                                        <FormField
                                          control={form.control}
                                          name={`dependentChildren.${index}.workType`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Work Type</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder={t('common.select')} />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value='Agriculture'>Agriculture</SelectItem>
                                                  <SelectItem value='Labor'>Labor</SelectItem>
                                                  <SelectItem value='Shop'>Shop</SelectItem>
                                                  <SelectItem value='Domestic'>Domestic</SelectItem>
                                                  <SelectItem value='Skilled'>Skilled</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name={`dependentChildren.${index}.monthlyIncome`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Monthly Income</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder={t('common.select')} />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value='1000-3000'>₹1,000 - ₹3,000</SelectItem>
                                                  <SelectItem value='3001-5000'>₹3,001 - ₹5,000</SelectItem>
                                                  <SelectItem value='5001-8000'>₹5,001 - ₹8,000</SelectItem>
                                                  <SelectItem value='8001-12000'>₹8,001 - ₹12,000</SelectItem>
                                                  <SelectItem value='12000+'>Above ₹12,000</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Economic Status - For adults with families or earning members */}
          {!isChild && (isMarried || isEmployed) && (
            <Card>
              <CardHeader>
                <CardTitle>{t('economic.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='familyIncome'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('economic.familyIncome')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='0-10000'>{t('employment.income1')}</SelectItem>
                            <SelectItem value='10001-25000'>{t('employment.income2')}</SelectItem>
                            <SelectItem value='25001-50000'>{t('employment.income3')}</SelectItem>
                            <SelectItem value='50001-100000'>{t('employment.income4')}</SelectItem>
                            <SelectItem value='100000+'>{t('employment.income5')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='earningMembers'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('economic.earningMembers')}</FormLabel>
                        <FormControl>
                          <Input type='number' min='0' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='primaryIncomeSource'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('economic.primarySource')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Farming'>{t('economic.farming')}</SelectItem>
                            <SelectItem value='Business'>{t('economic.business')}</SelectItem>
                            <SelectItem value='Job'>{t('economic.job')}</SelectItem>
                            <SelectItem value='Labor'>{t('economic.labor')}</SelectItem>
                            <SelectItem value='Pension'>{t('economic.pension')}</SelectItem>
                            <SelectItem value='Other'>{t('economic.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='housingStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('economic.housing')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Owned'>{t('economic.owned')}</SelectItem>
                            <SelectItem value='Rented'>{t('economic.rented')}</SelectItem>
                            <SelectItem value='Family'>{t('economic.family')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch('housingStatus') === 'Rented' && (
                    <FormField
                      control={form.control}
                      name='monthlyRent'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('economic.rent')}</FormLabel>
                          <FormControl>
                            <Input type='number' min='0' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className='mt-4'>
                  <FormField
                    control={form.control}
                    name='assets'
                    render={() => (
                      <FormItem>
                        <div className='mb-4'>
                          <FormLabel>{t('economic.assets')}</FormLabel>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                          {['Land', 'Vehicle', 'Livestock', 'Savings'].map(item => (
                            <FormField
                              key={item}
                              control={form.control}
                              name='assets'
                              render={({ field }) => {
                                return (
                                  <FormItem key={item} className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(field.value?.filter(value => value !== item))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{t(`economic.${item.toLowerCase()}`)}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Information - For adults */}
          {!isChild && (
            <Card>
              <CardHeader>
                <CardTitle>{t('health.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='healthInsurance'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('health.insurance')}</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-row space-x-4'
                        >
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='Yes' />
                            </FormControl>
                            <FormLabel className='font-normal'>{t('common.yes')}</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='No' />
                            </FormControl>
                            <FormLabel className='font-normal'>{t('common.no')}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {healthInsurance === 'Yes' && (
                    <FormField
                      control={form.control}
                      name='insuranceType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.insuranceType')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder={t('common.select')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Government'>{t('health.government')}</SelectItem>
                              <SelectItem value='Private'>{t('health.private')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='disability'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('health.disability')}</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-row space-x-4'
                        >
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='Yes' />
                            </FormControl>
                            <FormLabel className='font-normal'>{t('common.yes')}</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='No' />
                            </FormControl>
                            <FormLabel className='font-normal'>{t('common.no')}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {disability === 'Yes' && (
                    <FormField
                      control={form.control}
                      name='disabilityType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.disabilityType')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name='medicalExpenses'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('health.medicalExpenses')}</FormLabel>
                        <FormControl>
                          <Input type='number' min='0' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Government Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>{t('benefits.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='bplCard'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('benefits.bpl')}</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-row space-x-4'
                      >
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='Yes' />
                          </FormControl>
                          <FormLabel className='font-normal'>{t('common.yes')}</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='No' />
                          </FormControl>
                          <FormLabel className='font-normal'>{t('common.no')}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {bplCard === 'Yes' && (
                  <FormField
                    control={form.control}
                    name='rationCardType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('benefits.ration')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='APL'>{t('benefits.apl')}</SelectItem>
                            <SelectItem value='BPL'>{t('benefits.bplCard')}</SelectItem>
                            <SelectItem value='Antyodaya'>{t('benefits.antyodaya')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className='mt-4'>
                <FormField
                  control={form.control}
                  name='governmentSchemes'
                  render={() => (
                    <FormItem>
                      <div className='mb-4'>
                        <FormLabel>{t('benefits.schemes')}</FormLabel>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        {['Pension', 'PMAY', 'Gas', 'Toilet', 'Other'].map(item => (
                          <FormField
                            key={item}
                            control={form.control}
                            name='governmentSchemes'
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className='flex flex-row items-start space-x-3 space-y-0'>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={checked => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(field.value?.filter(value => value !== item))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal'>{t(`benefits.${item.toLowerCase()}`)}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assistance Needs */}
          <Card>
            <CardHeader>
              <CardTitle>{t('assistance.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='assistanceNeeds'
                  render={() => (
                    <FormItem>
                      <div className='mb-4'>
                        <FormLabel>{t('assistance.needs')}</FormLabel>
                      </div>
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                        {[
                          'Education',
                          'Healthcare',
                          'Employment',
                          'Housing',
                          'Financial',
                          'Food',
                          'Elderly',
                          'Disability'
                        ].map(item => (
                          <FormField
                            key={item}
                            control={form.control}
                            name='assistanceNeeds'
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className='flex flex-row items-start space-x-3 space-y-0'>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={checked => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(field.value?.filter(value => value !== item))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal'>{t(`assistance.${item.toLowerCase()}`)}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='priorityLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('assistance.priority')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('common.select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='High'>{t('assistance.high')}</SelectItem>
                          <SelectItem value='Medium'>{t('assistance.medium')}</SelectItem>
                          <SelectItem value='Low'>{t('assistance.low')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          <Card>
            <CardContent className='pt-6'>
              <FormField
                control={form.control}
                name='comments'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.comments')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>{t('common.optional')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className='flex gap-4 items-center justify-between'>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              <ChevronLeft className='h-4 w-4 mr-2' />

              {'Go Back'}
            </Button>
            <div className='flex items-center gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  onSubmit(form.getValues())
                  resetForm()
                }}
                className=''
              >
                <UserPlus className='h-4 w-4 mr-2' />
                {t('common.addAnother')}
              </Button>
              <Button type='submit' className=''>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
