// Auth utilities barrel export
export { getUser, getUserOrThrow, isAuthenticated, getSupabaseUser } from "./get-user"
export { requireAuth, redirectIfAuthenticated } from "./require-auth"
export { getAuthErrorMessage, getDefaultErrorMessage } from "./errors"
export type { AuthResult, OAuthProvider } from "./types"

// Server action auth wrappers
export {
  withAuth,
  withAuthQuery,
  withAuthNoInput,
  withAuthQueryNoInput,
  type AuthUser,
  type AuthContext,
} from "./with-auth"

