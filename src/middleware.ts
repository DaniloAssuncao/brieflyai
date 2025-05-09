import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If not authenticated, redirect to /auth
    if (!req.nextauth.token) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/auth?from=${encodeURIComponent(from)}`, req.url)
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