import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          console.log('Connecting to database...')
          await connectToDatabase()
          
          console.log('Looking for user with email:', credentials.email)
          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            console.log('User not found')
            return null
          }

          console.log('User found, checking password...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          console.log('Login successful for user:', user.email)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error('Error in authorize:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If url is provided and is a relative path, use it
      if (url?.startsWith('/')) return `${baseUrl}${url}`
      // If url is provided and is an absolute URL with the same origin, use it
      if (url?.startsWith(baseUrl)) return url
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-temporary-secret-key',
  debug: true
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 