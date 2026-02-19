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
    /** OpenAI API key for AI chatbot */
    OPENAI_API_KEY: string
    /** AI model override (e.g. "openai:gpt-4o" or "anthropic:claude-3-haiku") */
    AI_MODEL?: string
    /** Anthropic API key (optional, for Claude models) */
    ANTHROPIC_API_KEY?: string
    /** Google Generative AI API key (optional, for Gemini models) */
    GOOGLE_GENERATIVE_AI_API_KEY?: string
    /**
     * Cloudflare Turnstile Site Key for CAPTCHA protection
     * Safe to expose in client-side code
     * @see https://developers.cloudflare.com/turnstile/
     */
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string
  }
}

