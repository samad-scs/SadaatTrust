import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
