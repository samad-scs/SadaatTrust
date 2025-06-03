import type { NextConfig } from 'next'

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

export default nextConfig
