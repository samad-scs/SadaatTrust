import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const HealthInformation = () => {
  const form = useFormContext()
  const t = useTranslations()

  const healthInsurance = form.watch('healthInsurance')
  const disability = form.watch('disability')

  return (
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
              <FormItem className='block space-y-3'>
                <FormLabel>{t('health.insurance')}</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-row space-x-4'
                >
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value={'yes'} />
                    </FormControl>
                    <FormLabel className='font-normal'>{t('common.yes')}</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='no' />
                    </FormControl>
                    <FormLabel className='font-normal'>{t('common.no')}</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          {healthInsurance === 'yes' && (
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
                      <SelectItem value='government'>{t('health.government')}</SelectItem>
                      <SelectItem value='private'>{t('health.private')}</SelectItem>
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
              <FormItem className='block space-y-3'>
                <FormLabel>{t('health.disability')}</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-row space-x-4'
                >
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='yes' />
                    </FormControl>
                    <FormLabel className='font-normal'>{t('common.yes')}</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='no' />
                    </FormControl>
                    <FormLabel className='font-normal'>{t('common.no')}</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          {disability === 'yes' && (
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
                  <NumberInput inputMode='numeric' maxLength={6} min='0' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default HealthInformation
