import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { prisma } from '@/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts'

import { getUserFromDb } from '@utils/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Credentials({
      authorize: async credentials => {
        try {
          let user = null

          const { email, password } = credentials as { email: string; password: string }

          user = await getUserFromDb(email)

          if (!user) return null

          // Compare input password with stored hash
          const isPasswordValid = compareSync(password, user.password)
          if (!isPasswordValid) {
            return null
          }

          // return JSON object with the user data
          return user
        } catch {
          return null
        }
      }
    })
  ],

  pages: { signIn: '/login' },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirect to /dashboard after successful login
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`
    }
  },
  session: { strategy: 'jwt' }
})
