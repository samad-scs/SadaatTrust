import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { assistanceNeeds } from '@/data/assistance-needs'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const AssistanceNeeds = () => {
  const form = useFormContext()
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('assistance.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-7'>
          <FormField
            control={form.control}
            name='assistanceNeeds'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel>{t('assistance.needs')}</FormLabel>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {assistanceNeeds.map(item => (
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
                                    : field.onChange(field.value?.filter((value: string) => value !== item))
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
                    <SelectItem value='high'>{t('assistance.high')}</SelectItem>
                    <SelectItem value='medium'>{t('assistance.medium')}</SelectItem>
                    <SelectItem value='low'>{t('assistance.low')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssistanceNeeds
