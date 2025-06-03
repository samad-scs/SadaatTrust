import React, { createContext, useContext } from 'react'

// Context value type
type AppDataContextType = {
  data: any
}

// Create context
const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

// Provider component
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppDataContext.Provider value={{ data: null }}>{children}</AppDataContext.Provider>
}

// Custom hook for consuming context
export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }

  return context
}
