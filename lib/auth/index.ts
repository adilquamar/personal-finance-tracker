// Auth utilities barrel export
export { getUser, getUserOrThrow, isAuthenticated, getSupabaseUser, type AuthUser } from "./get-user"
export { requireAuth, redirectIfAuthenticated } from "./require-auth"
export { getAuthErrorMessage, getDefaultErrorMessage } from "./errors"
export type { AuthResult, OAuthProvider } from "./types"

