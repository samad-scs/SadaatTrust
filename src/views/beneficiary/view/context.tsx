'use client'

import React, { ReactNode, createContext, useContext } from 'react'

import { useParams } from 'next/navigation'

import { Beneficiary } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

import { fetchBeneficiaryById } from '@/services/beneficiary'

// Types for the context
interface BeneficiaryData {
  beneficiary: Beneficiary
  dependentChildren: Beneficiary[]
}

interface BeneficiaryContextType {
  data: BeneficiaryData | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  beneficiary: Beneficiary | null
  dependentChildren: Beneficiary[]
}

// Create the context
const BeneficiaryContext = createContext<BeneficiaryContextType | undefined>(undefined)

// Provider component
interface BeneficiaryProviderProps {
  children: ReactNode
  beneficiaryId?: string
}

export const BeneficiaryProvider: React.FC<BeneficiaryProviderProps> = ({ children, beneficiaryId }) => {
  const params = useParams()
  const id = beneficiaryId || (params?.id as string)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['beneficiary', id],
    queryFn: () => fetchBeneficiaryById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes (formerly cacheTime)
  })

  const contextValue: BeneficiaryContextType = {
    data: data || null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    beneficiary: data?.beneficiary || null,
    dependentChildren: data?.dependentChildren || []
  }

  return <BeneficiaryContext.Provider value={contextValue}>{children}</BeneficiaryContext.Provider>
}

// Custom hook to use the context
export const useBeneficiary = (): BeneficiaryContextType => {
  const context = useContext(BeneficiaryContext)

  if (context === undefined) {
    throw new Error('useBeneficiary must be used within a BeneficiaryProvider')
  }

  return context
}

// Additional utility hooks for specific use cases
export const useBeneficiaryData = () => {
  const { data, isLoading, isError, error } = useBeneficiary()

  return { data, isLoading, isError, error }
}

export const useBeneficiaryBasic = () => {
  const { beneficiary, isLoading, isError } = useBeneficiary()

  return { beneficiary, isLoading, isError }
}

export const useDependentChildren = () => {
  const { dependentChildren, isLoading, isError } = useBeneficiary()

  return { dependentChildren, isLoading, isError }
}

// Hook for refetching data
export const useBeneficiaryRefetch = () => {
  const { refetch } = useBeneficiary()

  return { refetch }
}
