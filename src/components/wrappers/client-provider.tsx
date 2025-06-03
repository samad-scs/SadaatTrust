'use client'

import React from 'react'

import { AppDataProvider } from '@/contexts/app-data.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>{children}</AppDataProvider>
    </QueryClientProvider>
  )
}

export default ClientProviders
