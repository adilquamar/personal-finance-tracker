import { z } from "zod"

/**
 * Schema for environment variables.
 * This validates environment variables at build/runtime to catch configuration
 * errors early rather than at runtime when the variables are actually used.
 */
const envSchema = z.object({
  /** Supabase project URL */
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  /** Supabase Publishable API Key - safe for client-side use */
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),
  /** Cloudflare Turnstile Site Key - optional for development */
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
})

/**
 * Validated environment variables.
 * Import this object instead of accessing process.env directly.
 * 
 * @example
 * import { env } from "@/lib/config/env"
 * 
 * const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
})

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>
