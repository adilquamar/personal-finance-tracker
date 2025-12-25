declare namespace NodeJS {
  interface ProcessEnv {
    /** Supabase project URL */
    NEXT_PUBLIC_SUPABASE_URL: string
    /** 
     * Supabase Publishable API Key (replaces legacy anon key)
     * Safe to expose in client-side code - respects RLS policies
     * @see https://supabase.com/docs/guides/api/api-keys
     */
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
    /** 
     * Supabase Secret API Key (replaces legacy service_role key)
     * Server-side only - bypasses RLS, never expose to client
     * @see https://supabase.com/docs/guides/api/api-keys
     */
    SUPABASE_SECRET_KEY: string
    OPENAI_API_KEY: string
  }
}

