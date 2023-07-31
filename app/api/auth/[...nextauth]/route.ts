import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest, NextResponse } from 'next/server'
import NextAuth, { getServerSession, type NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import requestErrorWrapper from '@/wrapper/error.wrapper'
import { setAccountDetails } from '@/lib/handlers'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'

export const nextAuthOptions = (req: NextApiRequest): NextAuthOptions => {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },

      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL as string)

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ]

  return {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({token}) {
        await mongoooseConnectionPromise
        // get user account using the signed ethereum address
        const userAccount = await setAccountDetails(token.sub as string, {address: token.sub})      
        token.user = userAccount
        return token
      },

      session({ session, token }: { session: any; token: any }) {
        const { email, emailVerified, roles, address } = token.user
        const user: Record<string, unknown> = {
          email,
          emailVerified,
          address
        }
        // if there's role, add it to user
        // By default, user address wouldn't have role. However, admin may have
        if (roles?.length) user.roles = roles
        session.user = user
        return session
      },
    },
  } satisfies NextAuthOptions
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
function authHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, nextAuthOptions(req))
}

// get session on the server
export function getAccountSession(req: NextApiRequest) {
  return getServerSession(nextAuthOptions(req))
}

const withErrorWrapper = requestErrorWrapper(authHandler)

export { withErrorWrapper as GET, withErrorWrapper as POST }

