"use client"

import { useSharedNavigation } from "@/lib/contexts"
import { cn } from "@/lib/utils"

/**
 * A thin progress bar displayed at the top of the viewport during page navigation.
 * Provides immediate visual feedback when users navigate between pages.
 */
export function NavigationProgress() {
  const { isPending } = useSharedNavigation()

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none",
        "transition-opacity duration-150",
        isPending ? "opacity-100" : "opacity-0"
      )}
      role="progressbar"
      aria-hidden={!isPending}
      aria-label="Page loading"
    >
      {/* Animated progress bar */}
      <div
        className={cn(
          "h-full bg-indigo-400",
          isPending && "animate-navigation-progress"
        )}
      />
    </div>
  )
}
