"use client"

import { NavigationProvider } from "@/lib/contexts"
import type { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

/**
 * Client-side providers wrapper.
 * Wraps the app with necessary context providers.
 */
export function Providers({ children }: ProvidersProps) {
  return <NavigationProvider>{children}</NavigationProvider>
}
