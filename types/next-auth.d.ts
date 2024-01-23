import NextAuth, { DefaultSession } from 'next-auth'
import type AccountType from '@/lib/types/account'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: AccountType
  }
}