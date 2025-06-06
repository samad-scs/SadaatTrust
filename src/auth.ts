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
    async jwt({ token, user }) {
      // When user logs in, attach data to the token
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.gender = user.gender
        token.phone = user.phone
        token.canViewData = user.canViewData
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.canViewData = token.canViewData as boolean
      }

      return session
    },

    authorized: async ({ auth }) => {
      if (!auth?.user?.email) return false

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
