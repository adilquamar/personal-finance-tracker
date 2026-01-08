"use client"

import { useRouter } from "next/navigation"
import { useTransition, useCallback, useState } from "react"

/**
 * Hook for navigation with loading state tracking.
 * Tracks which specific href is currently navigating.
 */
export function useNavigation() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const navigate = useCallback(
    (href: string) => {
      setPendingHref(href)
      startTransition(() => {
        router.push(href)
      })
    },
    [router, startTransition]
  )

  const isNavigating = useCallback(
    (href?: string) => {
      if (!href) return isPending
      return isPending && pendingHref === href
    },
    [isPending, pendingHref]
  )

  return {
    /** Navigate to a URL with transition */
    navigate,
    /** Check if currently navigating (optionally to a specific href) */
    isNavigating,
    /** Whether any navigation is in progress */
    isPending,
    /** The href currently being navigated to */
    pendingHref,
  }
}
