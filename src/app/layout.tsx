import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import NextProgress from '@/components/custom/next-progress'
import { Toaster } from '@/components/ui/sonner'
import Providers from '@/components/wrappers/server-provider'

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
          <NextProgress />
          <Providers>{children}</Providers>
          <Toaster position='top-right' closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
