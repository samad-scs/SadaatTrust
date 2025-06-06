'use client'

import { ThreeDots } from 'react-loader-spinner'

import Image from 'next/image'

import logo from '@public/sadaat-logo.jpg'

type FallbackSpinnerProps = {
  page?: boolean
  className?: string
}

const FallbackSpinner = ({ page = false, className }: FallbackSpinnerProps) => {
  return (
    <div
      suppressHydrationWarning
      className={`${!page ? 'min-h-[80vh]' : 'min-h-screen'} flex w-full flex-col items-center justify-center gap-1 ${className}`}
    >
      <Image src={logo} alt='logo' width={70} height={70} className={`h-auto w-full max-w-20`} priority />
      <ThreeDots
        visible={true}
        height='50'
        width='50'
        color={'var(--primary)'}
        radius='9'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        wrapperClass=''
      />
    </div>
  )
}

export default FallbackSpinner
