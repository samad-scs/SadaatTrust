'use client'

import { useForm } from 'react-hook-form'

import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result: any = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: true, // Enable redirect
        redirectTo: '/dashboard' // Specify the redirect URL
      })

      if (result?.error) {
        console.error('Login error:', result.error)

        // Optionally display error to the user
        form.setError('root', { message: 'Invalid email or password' })
      }
    } catch (error) {
      console.error('Unexpected error during login:', error)
      form.setError('root', { message: 'An unexpected error occurred' })
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
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
