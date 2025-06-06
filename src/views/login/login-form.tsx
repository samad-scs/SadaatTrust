'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
})

function LoginForm({ className }: React.ComponentProps<'form'>) {
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result: any = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false, // Prevent page refresh
        redirectTo: searchParams.get('callbackUrl') || '/dashboard'
      })

      if (result?.error) {
        toast.error('Invalid credentials') // Show toast on error
        form.setError('root', { message: 'Invalid email or password' })
      } else {
        toast.success('Logged in successfully') // Show toast on error

        window.location.reload()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Unexpected error during login:', error)
    }
  }

  return (
    <Form {...form}>
      <form className={cn('flex flex-col gap-6', className)} onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Login to your account</h1>
          <p className='text-muted-foreground text-sm text-balance'>Enter your email below to login to your account</p>
        </div>
        <div className='grid gap-6'>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} placeholder='m@example.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input type={showPassword ? 'text' : 'password'} placeholder='Enter new password' {...field} />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
