/**
 * Result type for authentication operations.
 * Either succeeds with an optional message, or fails with an error.
 * Note: Successful auth with immediate session uses redirect() and never returns.
 */
export type AuthResult = {
  success: true
  message?: string
} | {
  success: false
  error: string
}

/**
 * Supported OAuth providers for social authentication.
 */
export type OAuthProvider = "google" | "github"

