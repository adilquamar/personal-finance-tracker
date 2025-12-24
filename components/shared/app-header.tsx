"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { SideNav } from "@/components/navigation"
import type { User } from "@supabase/supabase-js"

// Routes where only the logo should be shown (Stripe pattern)
const minimalHeaderRoutes = ["/login", "/signup", "/forgot-password"]

interface AppHeaderProps {
  user?: User | null
  onLogout?: () => void
}

export function AppHeader({ user = null, onLogout }: AppHeaderProps) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on an auth page that should show minimal header
  const isMinimalHeader = minimalHeaderRoutes.includes(pathname)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Logo />

          {/* Only show navigation on non-auth pages */}
          {!isMinimalHeader && (
            <div className="flex items-center gap-3">
              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center gap-3">
                {user ? (
                  <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5">
                    <Link href="/dashboard">
                      Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="text-gray-700 hover:bg-gray-100">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5">
                      <Link href="/signup">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Hamburger menu */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSideNavOpen(true)}
                aria-label="Open menu"
                className="text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Side Navigation */}
      <SideNav
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        user={user}
        onLogout={onLogout}
      />
    </>
  )
}

