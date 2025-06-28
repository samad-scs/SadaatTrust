'use client'

import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { handleUpperCaseChange } from '../form.schema'

const BasicInformation = () => {
  const form = useFormContext()
  const t = useTranslations()

  return (
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
                  <Input {...field} maxLength={150} onChange={handleUpperCaseChange(field?.onChange)} />
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
                  <Input type='number' min='1' max='120' {...field} maxLength={3} />
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
                    <SelectItem value='male'>{t('basic.male')}</SelectItem>
                    <SelectItem value='female'>{t('basic.female')}</SelectItem>
                    <SelectItem value='other'>{t('basic.other')}</SelectItem>
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
                  <Input {...field} maxLength={10} />
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
                  <Textarea
                    {...field}
                    onChange={e => handleUpperCaseChange(field?.onChange)(e as any)}
                    maxLength={300}
                  />
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

export default BasicInformation
