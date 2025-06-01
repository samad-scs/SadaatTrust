import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'

import './globals.css'

export const metadata: Metadata = {
  title: 'Sadaat Trust',
  description: 'Trust that helps people in need in Thasara Saiyed Samaaj'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <SessionProvider>{children}</SessionProvider>
          <Toaster position='top-left' richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
