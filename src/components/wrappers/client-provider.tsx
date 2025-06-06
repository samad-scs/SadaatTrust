'use client'

import React from 'react'

import { AppDataProvider } from '@/contexts/app-data.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthGuard from './auth-guard'

const queryClient = new QueryClient()

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <AppDataProvider>{children}</AppDataProvider>
      </AuthGuard>
    </QueryClientProvider>
  )
}

export default ClientProviders
