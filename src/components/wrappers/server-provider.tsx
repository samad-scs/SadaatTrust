import React from 'react'

import { SessionProvider } from 'next-auth/react'

import ClientProviders from './client-provider'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ClientProviders>{children}</ClientProviders>
    </SessionProvider>
  )
}

export default Providers
