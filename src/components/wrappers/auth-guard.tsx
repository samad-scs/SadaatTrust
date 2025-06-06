'use client'

import React from 'react'

import { useSession } from 'next-auth/react'

import FallbackSpinner from '../custom/spinner'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  //   const router = useRouter()
  const { status } = useSession()

  if (status === 'loading') {
    return <FallbackSpinner page />
  }

  // If user is not logged in (render pages like login, register etc..)
  return <>{children}</>
}

export default AuthGuard
