import { z } from "zod"

/**
 * Schema for environment variables.
 * This validates environment variables at runtime to catch configuration
 * errors early rather than when the variables are actually used.
 */
const envSchema = z.object({
  /** Supabase project URL */
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  /** Supabase Publishable API Key - safe for client-side use */
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),
  /** Cloudflare Turnstile Site Key - optional for development */
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  /** Secret token for authenticating Vercel Cron requests - optional, only set in production */
  CRON_SECRET: z.string().optional(),
})

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Lazily validated environment variables.
 * Validation runs on first access rather than at import time,
 * which prevents build-time crashes when env vars aren't yet available.
 *
 * Import this object instead of accessing process.env directly.
 *
 * @example
 * import { env } from "@/lib/config/env"
 *
 * const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
 */
let _env: Env | undefined

function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      CRON_SECRET: process.env.CRON_SECRET,
    })
  }
  return _env
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof Env]
  },
})
