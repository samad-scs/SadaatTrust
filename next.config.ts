import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
        locale: false
      }
    ]
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
