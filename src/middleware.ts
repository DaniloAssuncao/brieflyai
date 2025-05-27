import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    
    // If not authenticated, redirect to /auth
    if (!req.nextauth.token) {
      let from = pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/auth?from=${encodeURIComponent(from)}`, baseUrl)
      )
    }
    
    // Otherwise, allow
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

// Configure which routes to protect
export const config = {
  matcher: [
    '/((?!api/auth|api|_next/static|_next/image|favicon.ico|public|auth).*)'
  ]
} 