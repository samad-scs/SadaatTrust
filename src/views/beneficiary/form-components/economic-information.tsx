import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { NumberInput } from '@/components/ui/number-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const EconomicInformation = () => {
  const form = useFormContext()
  const t = useTranslations()

  return (
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
                  <NumberInput inputMode='numeric' {...field} maxLength={2} />
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
                    <SelectItem value='farming'>{t('economic.farming')}</SelectItem>
                    <SelectItem value='business'>{t('economic.business')}</SelectItem>
                    <SelectItem value='job'>{t('economic.job')}</SelectItem>
                    <SelectItem value='labor'>{t('economic.labor')}</SelectItem>
                    <SelectItem value='pension'>{t('economic.pension')}</SelectItem>
                    <SelectItem value='other'>{t('economic.other')}</SelectItem>
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
                    <SelectItem value='owned'>{t('economic.owned')}</SelectItem>
                    <SelectItem value='rented'>{t('economic.rented')}</SelectItem>
                    <SelectItem value='family'>{t('economic.family')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('housingStatus') === 'rented' && (
            <FormField
              control={form.control}
              name='monthlyRent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('economic.rent')}</FormLabel>
                  <FormControl>
                    <NumberInput inputMode='numeric' maxLength={6} {...field} />
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
                                    : field.onChange(field.value?.filter((value: string) => value !== item))
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
  )
}

export default EconomicInformation
