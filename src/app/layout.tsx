import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'

import NextProgress from '@/components/custom/next-progress'
import { Toaster } from '@/components/ui/sonner'
import Providers from '@/components/wrappers/server-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Sadaat Trust',
  description: 'Trust that helps people in need in Thasra Saiyed Samaaj'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            <NextProgress />
            <Providers>{children}</Providers>
            <Toaster position='top-right' closeButton richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
