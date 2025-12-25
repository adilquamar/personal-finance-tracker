/**
 * Result type for authentication operations.
 * Either succeeds with an optional message, or fails with an error.
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

