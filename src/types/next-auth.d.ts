/* eslint-disable no-unused-vars */
import { User as NextAuthUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends NextAuthUser {
    id: string
    email: string
    name: string
    gender: string
    phone: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    email?: string
    name?: string
    gender?: string
    phone?: string
    encrypted?: string
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends NextAuthUser {
    id: string
    email: string
    name: string
    gender: string
    phone: string
  }
}
