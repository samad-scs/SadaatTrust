'use client'

import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { handleUpperCaseChange } from '../form.schema'

const AdultInformation = () => {
  const form = useFormContext()
  const t = useTranslations()
  const isElderly = Number(form.watch('age')) >= 50

  return (
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
                    <SelectItem value='single'>{t('adult.single')}</SelectItem>
                    <SelectItem value='married'>{t('adult.married')}</SelectItem>
                    <SelectItem value='divorced'>{t('adult.divorced')}</SelectItem>
                    <SelectItem value='widowed'>{t('adult.widowed')}</SelectItem>
                    <SelectItem value='separated'>{t('adult.separated')}</SelectItem>
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
                        <SelectItem value='excellent'>{t('elderly.excellent')}</SelectItem>
                        <SelectItem value='good'>{t('elderly.good')}</SelectItem>
                        <SelectItem value='fair'>{t('elderly.fair')}</SelectItem>
                        <SelectItem value='poor'>{t('elderly.poor')}</SelectItem>
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
                      <Input {...field} maxLength={150} onChange={handleUpperCaseChange(field?.onChange)} />
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
                      <Input {...field} maxLength={150} onChange={handleUpperCaseChange(field?.onChange)}/>
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
  )
}

export default AdultInformation
