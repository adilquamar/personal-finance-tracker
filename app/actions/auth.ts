"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/lib/validations/auth"
import { getAuthErrorMessage, getDefaultErrorMessage } from "@/lib/auth/errors"
import type { AuthResult, OAuthProvider } from "@/lib/auth/types"

// Re-export types for consumers
export type { AuthResult, OAuthProvider } from "@/lib/auth/types"

/**
 * Signs up a new user with email and password.
 * Stores the user's full name in user metadata.
 * 
 * If email confirmation is required, returns success with a message.
 * If immediate session (email confirmation disabled), sets cookies and redirects.
 * 
 * @param formData - The signup form data
 * @param redirectTo - URL to redirect to after successful sign-up (default: "/dashboard")
 */
export async function signUp(formData: SignupFormData, redirectTo: string = "/dashboard"): Promise<AuthResult> {
  const validationResult = signupSchema.safeParse(formData)
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0]?.message || "Invalid form data",
    }
  }

  const { email, password, fullName } = validationResult.data
  let shouldRedirect = false

  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${await getBaseUrl()}/auth/callback`,
      },
    })

    if (error) {
      console.error("Signup error:", error.message)
      return { success: false, error: getAuthErrorMessage(error.message) }
    }

    // Check if user already exists (Supabase returns user but no session for existing users)
    if (data.user && !data.session) {
      const createdAt = new Date(data.user.created_at)
      const timeDiff = Date.now() - createdAt.getTime()
      
      // If the user was created more than 10 seconds ago, they likely already exist
      if (timeDiff > 10000) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        }
      }
      
      return { success: true, message: "Please check your email to verify your account." }
    }

    // If we got a session, the user is signed in (email confirmation disabled)
    // With @supabase/ssr@0.8.0+, cookies are automatically set via the setAll callback
    if (data.session) {
      revalidatePath("/", "layout")
      shouldRedirect = true
    } else {
      return { success: true, message: "Please check your email to verify your account." }
    }
  } catch (error) {
    console.error("Unexpected signup error:", error)
    return { success: false, error: getDefaultErrorMessage() }
  }
  
  // Redirect after cookies are set (outside try/catch because redirect throws)
  if (shouldRedirect) {
    redirect(redirectTo)
  }
  
  return { success: true, message: "Please check your email to verify your account." }
}

/**
 * Signs in a user with email and password.
 * On success, sets auth cookies and redirects to the specified URL.
 * Only returns on error.
 * 
 * @param formData - The login form data
 * @param redirectTo - URL to redirect to after successful sign-in (default: "/dashboard")
 */
export async function signIn(formData: LoginFormData, redirectTo: string = "/dashboard"): Promise<AuthResult> {
  const validationResult = loginSchema.safeParse(formData)
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0]?.message || "Invalid form data",
    }
  }

  const { email, password } = validationResult.data

  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Sign in error:", error.message)
      return { success: false, error: getAuthErrorMessage(error.message) }
    }

    // Verify session was established
    if (!data.session) {
      console.error("Sign in succeeded but no session returned")
      return { success: false, error: "Failed to establish session. Please try again." }
    }

    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Unexpected sign in error:", error)
    return { success: false, error: getDefaultErrorMessage() }
  }
  
  // Redirect after cookies are set (outside try/catch because redirect throws)
  redirect(redirectTo)
}

/**
 * Signs out the current user and redirects to home.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

/**
 * Initiates OAuth sign-in with the specified provider.
 * Returns the URL to redirect the user to for OAuth flow.
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${await getBaseUrl()}/auth/callback` },
    })

    if (error) {
      console.error("OAuth error:", error.message)
      return { error: getAuthErrorMessage(error.message) }
    }

    if (data.url) {
      return { url: data.url }
    }

    return { error: "Failed to initiate OAuth sign-in" }
  } catch (error) {
    console.error("Unexpected OAuth error:", error)
    return { error: getDefaultErrorMessage() }
  }
}

/**
 * Sends a password reset email to the specified address.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${await getBaseUrl()}/auth/callback?next=/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error.message)
      return { success: false, error: getAuthErrorMessage(error.message) }
    }

    return {
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    }
  } catch (error) {
    console.error("Unexpected password reset error:", error)
    return { success: false, error: getDefaultErrorMessage() }
  }
}

/**
 * Gets the base URL for redirects using request headers.
 */
async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}
