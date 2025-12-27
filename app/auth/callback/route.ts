import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * OAuth Callback Handler
 * 
 * This route handles the callback from OAuth providers (Google, GitHub, etc.)
 * and email confirmation links. It exchanges the authorization code for a session.
 * 
 * Flow:
 * 1. User clicks OAuth button -> redirected to provider
 * 2. Provider authenticates user -> redirects back to this route with a `code`
 * 3. This handler exchanges the `code` for a session
 * 4. User is redirected to the dashboard (or custom `next` URL)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth provider errors (e.g., user denied access)
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  // If no code is present, redirect to login with an error
  if (!code) {
    console.error('No code provided in OAuth callback')
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'Authentication failed. Please try again.')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = await createClient()
    
    // Exchange the authorization code for a session
    // This also sets the session cookies via the setAll callback
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError.message)
      const loginUrl = new URL('/login', requestUrl.origin)
      loginUrl.searchParams.set('error', 'Failed to complete sign in. Please try again.')
      return NextResponse.redirect(loginUrl)
    }

    // Successfully authenticated - redirect to the intended destination
    // The `next` parameter allows for flexible redirects (e.g., password reset flow)
    const redirectUrl = new URL(next, requestUrl.origin)
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error)
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(loginUrl)
  }
}

