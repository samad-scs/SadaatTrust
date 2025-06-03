import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { createNewAdminUserAPI } from '@/services/db/users'

interface AdminUserFormProps {
  open: boolean
  // eslint-disable-next-line no-unused-vars
  setOpen: (v: boolean) => void
  editData?: User
  refetch: () => void
}

// Define Zod schema for form validation
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(40, { message: 'Name must not exceed 40 characters' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(50, { message: 'Email must not exceed 50 characters' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password must not exceed 100 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  canViewData: z.boolean().optional()
})

type FormType = z.infer<typeof formSchema>

const defaultValues: FormType = {
  name: '',
  email: '',
  phone: '',
  gender: 'Male',
  password: '',
  canViewData: false
}

const AdminUserForm: React.FC<AdminUserFormProps> = ({ open, setOpen, refetch, editData }) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (formData: FormType) => {
    if (!!editData) {
      return
    }

    const response = await createNewAdminUserAPI(formData)

    if (response?.status) {
      setOpen(false)
      refetch()
    }
  }

  useEffect(() => {
    if (!!open && !!editData) {
      form.reset({
        name: editData?.name,
        email: editData?.email,
        canViewData: editData?.canViewData,
        gender: editData?.gender,
        phone: editData?.phone
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData, open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editData ? 'Update User' : 'Add User'}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='h-full'>
            <div className='grid flex-1 auto-rows-min gap-6 px-4'>
              {/* Name */}
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={40} placeholder='eg. User Saiyad' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={50} placeholder='eg. user@sadaat.com' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Phone */}
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type='tel'
                          inputMode='tel'
                          maxLength={10}
                          {...field}
                          onChange={e => {
                            const value = e.target.value
                            if (value === '' || /^\d*$/.test(value)) {
                              field.onChange(value)
                            }
                          }}
                          placeholder='eg. 1234567890'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Gender */}
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Male'>Male</SelectItem>
                            <SelectItem value='Female'>Female</SelectItem>
                            <SelectItem value='Other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Password */}
              {!editData && (
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' maxLength={100} {...field} placeholder='Enter a secure password' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <SheetFooter className='flex flex-col gap-3 md:flex-row-reverse md:justify-between md:items-center w-full'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
              <SheetClose asChild>
                <Button variant='outline'>Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default AdminUserForm
