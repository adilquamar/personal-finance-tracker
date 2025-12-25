import { redirect } from "next/navigation"
import { getUser, type AuthUser } from "./get-user"

type RequireAuthOptions = {
  /** URL to redirect to if not authenticated (default: "/login") */
  redirectTo?: string
}

/**
 * Ensures the current request is authenticated.
 * Redirects to login page if not authenticated.
 * 
 * Use this at the top of Server Components or Server Actions
 * that require authentication.
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const user = await requireAuth()
 *   return <div>Welcome, {user.fullName}!</div>
 * }
 * ```
 * 
 * @param options - Configuration options
 * @returns The authenticated user
 */
export async function requireAuth(options: RequireAuthOptions = {}): Promise<AuthUser> {
  const { redirectTo = "/login" } = options
  
  const user = await getUser()
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return user
}

/**
 * Redirects authenticated users away from the current page.
 * Use this for pages like login/signup that should only be
 * accessible to unauthenticated users.
 * 
 * @example
 * ```tsx
 * // In login page
 * export default async function LoginPage() {
 *   await redirectIfAuthenticated()
 *   return <LoginForm />
 * }
 * ```
 * 
 * @param redirectTo - URL to redirect authenticated users to (default: "/dashboard")
 */
export async function redirectIfAuthenticated(redirectTo: string = "/dashboard"): Promise<void> {
  const user = await getUser()
  
  if (user) {
    redirect(redirectTo)
  }
}

