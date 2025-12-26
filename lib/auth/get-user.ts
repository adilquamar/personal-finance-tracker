import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

export type AuthUser = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
}

/**
 * Gets the currently authenticated user.
 * Returns null if no user is authenticated.
 * 
 * This function is designed to be called from Server Components,
 * Server Actions, and Route Handlers.
 * 
 * @returns The authenticated user or null
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  
  // getUser() validates the session server-side by calling Supabase Auth API
  // This is the secure way to get the user (vs getSession which only reads local data)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return mapSupabaseUser(user)
}

/**
 * Gets the currently authenticated user or throws an error.
 * Use this in contexts where you expect a user to be authenticated.
 * 
 * @throws Error if no user is authenticated
 * @returns The authenticated user
 */
export async function getUserOrThrow(): Promise<AuthUser> {
  const user = await getUser()
  
  if (!user) {
    throw new Error("User not authenticated")
  }
  
  return user
}

/**
 * Checks if a user is currently authenticated.
 * This is a lightweight check that doesn't return user details.
 * 
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return !!user
}

/**
 * Gets the raw Supabase user object.
 * Use this when you need access to all Supabase user properties.
 * 
 * @returns The Supabase User object or null
 */
export async function getSupabaseUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Maps a Supabase User to our AuthUser type.
 */
function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email || "",
    fullName: user.user_metadata?.full_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
    createdAt: user.created_at,
  }
}
