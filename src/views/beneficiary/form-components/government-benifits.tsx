import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const GovernmentBenifits = () => {
  const form = useFormContext()
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('benefits.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-y-4 gap-x-8 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='rationCardType'
            render={({ field }) => (
              <FormItem className='block space-y-3'>
                <FormLabel>{t('benefits.ration')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t('common.select')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='none'>{'None'}</SelectItem>
                    <SelectItem value='antyodaya'>{t('benefits.antyodaya')}</SelectItem>
                    <SelectItem value='apl'>{t('benefits.apl')}</SelectItem>
                    <SelectItem value='bpl'>{t('benefits.bplCard')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='governmentSchemes'
            render={() => (
              <FormItem>
                <div className='mb-2'>
                  <FormLabel>{t('benefits.schemes')}</FormLabel>
                </div>

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
                                  : field.onChange(field.value?.filter((value: string) => value !== item))
                              }}
                            />
                          </FormControl>
                          <FormLabel className='font-normal'>{t(`benefits.${item.toLowerCase()}`)}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default GovernmentBenifits
