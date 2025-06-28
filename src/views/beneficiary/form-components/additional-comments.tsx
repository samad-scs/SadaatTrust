import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const AdditionalComment = () => {
  const form = useFormContext()
  const t = useTranslations()

  return (
    <Card className='gap-3'>
      <CardHeader>
        <CardTitle>{t('common.comments')}</CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <FormField
          control={form.control}
          name='comments'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormDescription>{t('common.optional')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default AdditionalComment
