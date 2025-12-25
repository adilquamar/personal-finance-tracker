"use client"

import { useRouter } from "next/navigation"
import { AppHeader } from "./app-header"
import { signOut } from "@/app/actions/auth"
import type { User } from "@supabase/supabase-js"

interface AppHeaderClientProps {
  user: User | null
}

/**
 * Client wrapper for AppHeader that handles the sign out action.
 * This component bridges the server-side user data with client-side interactions.
 */
export function AppHeaderClient({ user }: AppHeaderClientProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.refresh()
  }

  return <AppHeader user={user} onLogout={handleLogout} />
}

