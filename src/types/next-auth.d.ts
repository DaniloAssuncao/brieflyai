import 'next-auth'
import { IUserSession } from './user'

declare module 'next-auth' {
  interface Session {
    user: IUserSession
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
} 