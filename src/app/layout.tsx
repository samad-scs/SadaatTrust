import type { Metadata } from 'next'

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
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
