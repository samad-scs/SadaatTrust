import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { handleUpperCaseChange } from '../form.schema'

const EmployementSection = () => {
  const form = useFormContext()
  const t = useTranslations()
  const isEmployed = form.watch('employmentStatus') === 'employed'

  return (
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
                    <SelectItem value='employed'>{t('employment.employed')}</SelectItem>
                    <SelectItem value='unemployed'>{t('employment.unemployed')}</SelectItem>
                    <SelectItem value='student'>{t('employment.student')}</SelectItem>
                    <SelectItem value='homemaker'>{t('employment.homemaker')}</SelectItem>
                    <SelectItem value='retired'>{t('employment.retired')}</SelectItem>
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
                        <SelectItem value='government'>{t('employment.government')}</SelectItem>
                        <SelectItem value='private'>{t('employment.private')}</SelectItem>
                        <SelectItem value='self-employed'>{t('employment.selfEmployed')}</SelectItem>
                        <SelectItem value='daily-wage'>{t('employment.daily')}</SelectItem>
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
                      <Input {...field} maxLength={100} onChange={handleUpperCaseChange(field?.onChange)} />
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
  )
}

export default EmployementSection
