import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for use in browser/client components.
 * This client is intended for client-side operations and respects RLS policies.
 * 
 * Uses the publishable API key which is safe to expose in client-side code.
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

