"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { env } from "@/lib/config/env"

interface TurnstileCaptchaProps {
  /** Callback when CAPTCHA verification succeeds */
  onSuccess: (token: string) => void
  /** Callback when CAPTCHA verification fails or expires */
  onError?: () => void
  /** Callback when CAPTCHA expires and needs to be re-verified */
  onExpire?: () => void
  /** Optional className for the container */
  className?: string
}

/**
 * Turnstile CAPTCHA component for bot protection.
 * Wraps @marsidev/react-turnstile with app-specific configuration.
 * 
 * Requires NEXT_PUBLIC_TURNSTILE_SITE_KEY environment variable.
 */
export function TurnstileCaptcha({
  onSuccess,
  onError,
  onExpire,
  className,
}: TurnstileCaptchaProps) {
  const turnstileRef = useRef<TurnstileInstance>(null)

  const handleError = useCallback(() => {
    onError?.()
  }, [onError])

  const handleExpire = useCallback(() => {
    onExpire?.()
  }, [onExpire])

  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Don't render if no site key is configured (allows development without CAPTCHA)
  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "TurnstileCaptcha: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. " +
        "CAPTCHA will be skipped in development. " +
        "Set this environment variable to enable CAPTCHA protection."
      )
    }
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          theme: "light",
          size: "flexible",
        }}
      />
    </div>
  )
}

/**
 * Hook to reset the Turnstile widget.
 * Useful when you need to reset after form submission.
 */
export function useTurnstileReset() {
  const reset = useCallback((ref: React.RefObject<TurnstileInstance | null>) => {
    ref.current?.reset()
  }, [])

  return reset
}
