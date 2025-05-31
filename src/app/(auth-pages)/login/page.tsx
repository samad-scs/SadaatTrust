import Image from 'next/image'

import bgImage from '@public/helping-kids.jpg'

import { LoginForm } from '@/views/login/login-form'

import { loginAction } from '@/services/actions/auth'

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2 svg-backgrounds'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            Sadaat Association.
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm action={loginAction} />
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <Image
          src={bgImage}
          fill
          priority
          sizes={'50vw'}
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  )
}
