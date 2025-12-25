/**
 * User-friendly error messages mapped from Supabase auth errors.
 */
const AUTH_ERRORS: Record<string, string> = {
  // Signup errors
  "User already registered": "An account with this email already exists. Please sign in instead.",
  "Password should be at least 6 characters": "Password must be at least 6 characters long.",
  "Unable to validate email address: invalid format": "Please enter a valid email address.",
  
  // Login errors
  "Invalid login credentials": "Invalid email or password. Please try again.",
  "Email not confirmed": "Please verify your email address before signing in.",
  "Too many requests": "Too many login attempts. Please wait a moment and try again.",
  
  // OAuth errors
  "OAuth provider error": "Unable to connect to the authentication provider. Please try again.",
  
  // Generic errors
  "default": "An unexpected error occurred. Please try again.",
}

/**
 * Maps Supabase auth error messages to user-friendly messages.
 * 
 * @param error - The error message from Supabase
 * @returns A user-friendly error message
 */
export function getAuthErrorMessage(error: string): string {
  // Check for exact match first
  if (AUTH_ERRORS[error]) {
    return AUTH_ERRORS[error]
  }
  
  // Check for partial match
  for (const [key, message] of Object.entries(AUTH_ERRORS)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }
  
  return AUTH_ERRORS["default"]
}

/**
 * Returns the default error message for unexpected errors.
 */
export function getDefaultErrorMessage(): string {
  return AUTH_ERRORS["default"]
}

