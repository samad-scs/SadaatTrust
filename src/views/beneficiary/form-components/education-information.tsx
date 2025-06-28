import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { BeneficiaryFormValues, handleUpperCaseChange } from '../form.schema'

const EducationInformation = () => {
  const form = useFormContext<BeneficiaryFormValues>()
  const t = useTranslations()
  const isChild = Number(form.watch('age')) < 18
  const educationStatus = form.watch('educationStatus')
  const educationLevel = form.watch('educationLevel')

  return (
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
                    <SelectItem value='noEducation'>{t('education.noEducation')}</SelectItem>
                    <SelectItem value='primary'>{t('education.primary')}</SelectItem>
                    <SelectItem value='Middle'>{t('education.middle')}</SelectItem>
                    <SelectItem value='secondary'>{t('education.secondary')}</SelectItem>
                    <SelectItem value='higher'>{t('education.higherSecondary')}</SelectItem>
                    <SelectItem value='graduate'>{t('education.graduate')}</SelectItem>
                    <SelectItem value='postgraduate'>{t('education.postGraduate')}</SelectItem>
                    <SelectItem value='doctorate'>{t('education.doctorate')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isChild && educationLevel !== 'noEducation' && (
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
                      <SelectItem value='studying'>{t('education.studying')}</SelectItem>
                      <SelectItem value='completed'>{t('education.completed')}</SelectItem>
                      <SelectItem value='dropped'>{t('education.dropped')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {educationStatus === 'studying' && educationLevel !== 'noEducation' && (
            <FormField
              control={form.control}
              name='institution'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('education.institution')}</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={200} onChange={handleUpperCaseChange(field?.onChange)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {educationStatus === 'dropped' && (
            <FormField
              control={form.control}
              name='droppedReason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('education.droppedReason')}</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={50} onChange={handleUpperCaseChange(field?.onChange)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default EducationInformation
