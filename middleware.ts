import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/auth/confirm']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Supabase session check for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, update the session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

