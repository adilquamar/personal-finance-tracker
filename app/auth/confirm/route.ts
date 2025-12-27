import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Email Confirmation Handler
 * 
 * This route handles email verification links sent by Supabase.
 * It verifies the token and establishes a session for the user.
 * 
 * Flow:
 * 1. User signs up → Supabase sends confirmation email
 * 2. User clicks link → redirected to this route with `token_hash` and `type`
 * 3. This handler verifies the token using `verifyOtp`
 * 4. On success: redirects to dashboard with success indicator
 * 5. On failure: redirects to login with error message
 * 
 * Query Parameters:
 * - token_hash: The verification token from the email link
 * - type: The type of verification (email, signup, recovery, invite, etc.)
 * - next: Optional redirect URL after verification (default: /dashboard)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  // Validate required parameters
  if (!token_hash || !type) {
    console.error('Missing token_hash or type in email confirmation')
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'Invalid verification link. Please request a new one.')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = await createClient()
    
    // Verify the OTP token
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('Email verification error:', error.message)
      
      // Provide user-friendly error messages
      let errorMessage = 'Email verification failed. Please try again.'
      
      if (error.message.includes('expired')) {
        errorMessage = 'Verification link has expired. Please request a new one.'
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Invalid verification link. Please request a new one.'
      }
      
      const loginUrl = new URL('/login', requestUrl.origin)
      loginUrl.searchParams.set('error', errorMessage)
      return NextResponse.redirect(loginUrl)
    }

    // Successfully verified - redirect with success indicator
    const redirectUrl = new URL(next, requestUrl.origin)
    redirectUrl.searchParams.set('verified', 'true')
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('Unexpected error in email confirmation:', error)
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(loginUrl)
  }
}

