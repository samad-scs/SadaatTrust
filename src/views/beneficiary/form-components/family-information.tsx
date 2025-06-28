import { useFieldArray, useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { v4 as uuidv4 } from 'uuid'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'

import { handleUpperCaseChange } from '../form.schema'
import DependentChildrenForm from './dependent-children'

const FamilyInformation = () => {
  const form = useFormContext()
  const t = useTranslations()

  const {
    fields: dependentChildrenFields,
    append: appendDependentChild,
    remove: removeDependentChild
  } = useFieldArray({
    control: form.control,
    name: 'dependentChildren'
  })

  const numberOfDependentChildren = Number(form.watch('numberOfDependentChildren')) || 0

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
                    <Input {...field} maxLength={100} onChange={handleUpperCaseChange(field?.onChange)} />
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
                    <NumberInput inputMode='numeric' {...field} maxLength={3} />
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
                    <Input {...field} maxLength={40} onChange={handleUpperCaseChange(field?.onChange)} />
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
                      maxLength={2}
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
                    <Input type='number' maxLength={2} min='0' {...field} />
                  </FormControl>
                  <FormDescription>Children who are financially independent</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {numberOfDependentChildren > 0 && (
            <div className='space-y-4'>
              {dependentChildrenFields.map((child, index) => (
                <DependentChildrenForm key={child.id} index={index} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FamilyInformation
