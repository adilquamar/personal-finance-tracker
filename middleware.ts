import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Routes that require authentication - redirect to /login if not authenticated
const protectedRoutes = ['/dashboard', '/analytics', '/chatbot']

// Auth routes - redirect to /dashboard if already authenticated
const authRoutes = ['/login', '/signup', '/forgot-password']

// Public routes that don't need any auth checks (excluding auth routes)
const publicRoutes = ['/', '/auth/callback', '/auth/confirm']

/**
 * Check if a pathname matches any route in the array
 * Handles both exact matches and prefix matches for nested routes
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a response that we'll modify with cookies
  let response = NextResponse.next({
    request,
  })

  // Create Supabase client for middleware
  // This pattern properly handles cookie reading/writing in middleware context
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // First, update the request cookies (for downstream middleware/handlers)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Then create a new response and set cookies on it
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Use getUser() to validate the session server-side
  // This also refreshes the session if needed and triggers setAll to update cookies
  const { data: { user } } = await supabase.auth.getUser()
  
  const isAuthenticated = !!user

  // 1. Protected routes: redirect to /login if not authenticated
  if (matchesRoute(pathname, protectedRoutes)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      // Store the intended destination for redirect after login
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // User is authenticated, allow access
    return response
  }

  // 2. Auth routes: redirect to /dashboard if already authenticated
  if (matchesRoute(pathname, authRoutes)) {
    if (isAuthenticated) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // User is not authenticated, allow access to auth pages
    return response
  }

  // 3. Public routes (including landing page): allow access regardless of auth status
  if (matchesRoute(pathname, publicRoutes)) {
    return response
  }

  // 4. For all other routes, just pass through with session refresh
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
