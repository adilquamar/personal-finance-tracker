import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { env } from '@/lib/config/env'

/**
 * Creates a Supabase client for use in browser/client components.
 * This client is intended for client-side operations and respects RLS policies.
 * 
 * Uses the publishable API key which is safe to expose in client-side code.
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

