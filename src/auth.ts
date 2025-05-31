import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt-ts'

import { encryptJWTwithJose } from '@utils/authorization'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Validate API_SECRET_KEY
const secretKey = process.env.API_SECRET_KEY!
if (!secretKey) {
  throw new Error('API_SECRET_KEY is not defined')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          phone: user.phone,
          emailVerified: null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60 // 2 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.gender = user.gender
        token.phone = user.phone
        token.encrypted = await encryptJWTwithJose({
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          phone: user.phone
        })
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id!
        session.user.email = token.email!
        session.user.name = token.name!
        session.user.gender = token.gender!
        session.user.phone = token.phone!
        session.encryptedToken = token.encrypted
      }

      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login'
  }
})
