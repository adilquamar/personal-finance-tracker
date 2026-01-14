import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Authenticated user context passed to action handlers
 */
export type AuthUser = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
}

/**
 * Context passed to authenticated action handlers
 */
export type AuthContext = {
  user: AuthUser
  supabase: SupabaseClient<Database>
}

/**
 * Standard result type for mutation actions
 */
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

/**
 * Options for the withAuth wrapper
 */
type WithAuthOptions = {
  /** Custom error message when user is not authenticated */
  errorMessage?: string
}

const DEFAULT_ERROR_MESSAGE = "You must be logged in to perform this action"

/**
 * Wraps a server action with authentication check.
 * Use this for mutation actions that return { success: true/false } results.
 *
 * Benefits:
 * - Eliminates repetitive auth checks in every action
 * - Single Supabase client creation (more efficient)
 * - Consistent error handling
 * - Full TypeScript support
 *
 * @example
 * // Define the action handler
 * async function addExpenseHandler(
 *   { user, supabase }: AuthContext,
 *   formData: ExpenseFormData
 * ): Promise<ActionResult<Expense>> {
 *   // No need to check auth or create client - already done!
 *   const { data, error } = await supabase
 *     .from("expenses")
 *     .insert({ user_id: user.id, ...formData })
 *     .select()
 *     .single()
 *
 *   if (error) return { success: false, error: "Failed to add expense" }
 *   return { success: true, data }
 * }
 *
 * // Export the wrapped action
 * export const addExpense = withAuth(addExpenseHandler)
 *
 * @param handler - The action handler that receives auth context and input
 * @param options - Optional configuration
 * @returns Wrapped action that handles auth automatically
 */
export function withAuth<TInput, TOutput>(
  handler: (ctx: AuthContext, input: TInput) => Promise<ActionResult<TOutput>>,
  options: WithAuthOptions = {}
): (input: TInput) => Promise<ActionResult<TOutput>> {
  const { errorMessage = DEFAULT_ERROR_MESSAGE } = options

  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    const supabase = await createClient()

    // Validate session server-side
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser()

    if (error || !supabaseUser) {
      return { success: false, error: errorMessage }
    }

    // Map to our AuthUser type
    const user: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      fullName: supabaseUser.user_metadata?.full_name || null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      createdAt: supabaseUser.created_at,
    }

    // Execute the handler with auth context
    return handler({ user, supabase }, input)
  }
}

/**
 * Wraps a server action with authentication check for query operations.
 * Use this for read-only actions that return data or a fallback value.
 *
 * Unlike withAuth, this returns a fallback value instead of an error object
 * when the user is not authenticated.
 *
 * @example
 * // Define the query handler
 * async function getExpensesHandler(
 *   { user, supabase }: AuthContext,
 *   limit: number
 * ): Promise<Expense[]> {
 *   const { data } = await supabase
 *     .from("expenses")
 *     .select("*")
 *     .eq("user_id", user.id)
 *     .limit(limit)
 *
 *   return data || []
 * }
 *
 * // Export with empty array as fallback for unauthenticated users
 * export const getExpenses = withAuthQuery(getExpensesHandler, [])
 *
 * @param handler - The query handler that receives auth context and input
 * @param fallback - Value to return if user is not authenticated
 * @returns Wrapped action that handles auth automatically
 */
export function withAuthQuery<TInput, TOutput>(
  handler: (ctx: AuthContext, input: TInput) => Promise<TOutput>,
  fallback: TOutput
): (input: TInput) => Promise<TOutput> {
  return async (input: TInput): Promise<TOutput> => {
    const supabase = await createClient()

    // Validate session server-side
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser()

    if (error || !supabaseUser) {
      return fallback
    }

    // Map to our AuthUser type
    const user: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      fullName: supabaseUser.user_metadata?.full_name || null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      createdAt: supabaseUser.created_at,
    }

    // Execute the handler with auth context
    return handler({ user, supabase }, input)
  }
}

/**
 * Variant of withAuth for actions with no input parameters.
 *
 * @example
 * const getCurrentUser = withAuthNoInput(
 *   async ({ user }) => ({ success: true, data: user })
 * )
 */
export function withAuthNoInput<TOutput>(
  handler: (ctx: AuthContext) => Promise<ActionResult<TOutput>>,
  options: WithAuthOptions = {}
): () => Promise<ActionResult<TOutput>> {
  const wrapped = withAuth<void, TOutput>(
    (ctx, _input) => handler(ctx),
    options
  )
  return () => wrapped(undefined as void)
}

/**
 * Variant of withAuthQuery for queries with no input parameters.
 *
 * @example
 * const getTotalExpenses = withAuthQueryNoInput(
 *   async ({ user, supabase }) => {
 *     const { data } = await supabase.from("expenses").select("amount")
 *     return data?.reduce((sum, e) => sum + e.amount, 0) || 0
 *   },
 *   0 // fallback
 * )
 */
export function withAuthQueryNoInput<TOutput>(
  handler: (ctx: AuthContext) => Promise<TOutput>,
  fallback: TOutput
): () => Promise<TOutput> {
  const wrapped = withAuthQuery<void, TOutput>(
    (ctx, _input) => handler(ctx),
    fallback
  )
  return () => wrapped(undefined as void)
}
