import { useFormContext } from 'react-hook-form'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { BeneficiaryFormValues, handleUpperCaseChange } from '../form.schema'

const DependentChildrenForm = ({ index }: { index: number }) => {
  const form = useFormContext<BeneficiaryFormValues>()
  const t = useTranslations()

  // Watch child-specific fields for conditional logic
  const childAge = Number(form.watch(`dependentChildren.${index}.age`)) || 0
  const childMaritalStatus = form.watch(`dependentChildren.${index}.maritalStatus`)
  const childEducationStatus = form.watch(`dependentChildren.${index}.educationStatus`)
  const childEmploymentStatus = form.watch(`dependentChildren.${index}.employmentStatus`)

  // Check for validation issues
  const isChildOver15 = childAge >= 15
  const isChildMarried = childMaritalStatus === 'married'

  const isChildEmployed = childEmploymentStatus === 'employed' || childEmploymentStatus === 'part-time'

  return (
    <Card>
      <CardHeader className='border-b'>
        <CardTitle>{`Child ${index + 1}`}</CardTitle>
      </CardHeader>
      <CardContent className=''>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name={`dependentChildren.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={40} onChange={handleUpperCaseChange(field?.onChange)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`dependentChildren.${index}.age`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <NumberInput inputMode='numeric' maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`dependentChildren.${index}.gender`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
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

          {/* Marital Status for children 15+ */}
          {isChildOver15 && (
            <FormField
              control={form.control}
              name={`dependentChildren.${index}.maritalStatus`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='single'>Single</SelectItem>
                      <SelectItem value='married'>Married</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Education Status */}
          <FormField
            control={form.control}
            name={`dependentChildren.${index}.educationStatus`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t('common.select')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='studying'>Currently Studying</SelectItem>
                    <SelectItem value='completed'>Education Completed</SelectItem>
                    <SelectItem value='dropped'>Dropped Out</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* If studying, show extra fields */}
          {childEducationStatus === 'studying' && (
            <>
              <FormField
                control={form.control}
                name={`dependentChildren.${index}.extraClasses`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Classes</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='yes'>Yes</SelectItem>
                        <SelectItem value='no'>No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dependentChildren.${index}.educationExpense`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Education Expense (₹)</FormLabel>
                    <FormControl>
                      <NumberInput inputMode='numeric' maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dependentChildren.${index}.lastResultPercentage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Result Percentage</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' max='100' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* If not studying, ask why */}
          {childEducationStatus === 'dropped' && (
            <FormField
              control={form.control}
              name={`dependentChildren.${index}.droppedReason`}
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Reason for Not Studying</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={200}
                      rows={4}
                      onChange={handleUpperCaseChange(field?.onChange) as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Employment Status for children 15+ */}
          {isChildOver15 && (
            <>
              <FormField
                control={form.control}
                name={`dependentChildren.${index}.employmentStatus`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select
                      onValueChange={value => {
                        // Auto-set to unemployed if married
                        if (isChildMarried && value !== 'unemployed') {
                          field.onChange('unemployed')
                        } else {
                          field.onChange(value)
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='employed' disabled={isChildMarried}>
                          Employed
                        </SelectItem>
                        <SelectItem value='unemployed'>Unemployed</SelectItem>
                        <SelectItem value='part-time' disabled={isChildMarried}>
                          Part-time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isChildMarried && childEmploymentStatus !== 'unemployed' && (
                      <FormDescription className='text-red-500 pl-2'>
                        Married dependent children must be unemployed
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* If employed, show work details */}
              {isChildEmployed && !isChildMarried && (
                <>
                  <FormField
                    control={form.control}
                    name={`dependentChildren.${index}.employmentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Type</FormLabel>
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
                            <SelectItem value='agriculture'>Agriculture</SelectItem>
                            <SelectItem value='daily-wage'>{t('employment.daily')}</SelectItem>
                            <SelectItem value='shop'>Shop</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dependentChildren.${index}.monthlyIncome`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Income</FormLabel>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DependentChildrenForm
