"use client"

import {
  createContext,
  useContext,
  useTransition,
  useCallback,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface NavigationContextType {
  /** Navigate to a URL with transition */
  navigate: (href: string) => void
  /** Check if currently navigating (optionally to a specific href) */
  isNavigating: (href?: string) => boolean
  /** Whether any navigation is in progress */
  isPending: boolean
  /** The href currently being navigated to */
  pendingHref: string | null
}

const NavigationContext = createContext<NavigationContextType | null>(null)

interface NavigationProviderProps {
  children: ReactNode
}

/**
 * Provider for shared navigation state across the app.
 * Enables the navigation progress bar to show loading state
 * regardless of which component triggers the navigation.
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
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
    [router]
  )

  const isNavigating = useCallback(
    (href?: string) => {
      if (!href) return isPending
      return isPending && pendingHref === href
    },
    [isPending, pendingHref]
  )

  return (
    <NavigationContext.Provider
      value={{ navigate, isNavigating, isPending, pendingHref }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

/**
 * Hook to access shared navigation state.
 * Returns a no-op implementation if used outside of NavigationProvider (e.g., during SSR).
 */
export function useSharedNavigation(): NavigationContextType {
  const context = useContext(NavigationContext)
  
  // Return a no-op implementation for SSR or when outside provider
  if (!context) {
    return {
      navigate: () => {},
      isNavigating: () => false,
      isPending: false,
      pendingHref: null,
    }
  }
  
  return context
}
