"use client"

import Link from "next/link"
import { LogOut, User as UserIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { getFilteredNavigation } from "@/lib/config/navigation"
import { NavGroup } from "./nav-group"
import type { User } from "@supabase/supabase-js"

interface SideNavProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onLogout?: () => void
}

export function SideNav({ isOpen, onClose, user, onLogout }: SideNavProps) {
  const isAuthenticated = !!user
  const navigationGroups = getFilteredNavigation(isAuthenticated)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-96 sm:max-w-96 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="flex items-center">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        {/* Navigation content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User profile section (authenticated only) */}
          {user && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation groups */}
          <div className="space-y-6">
            {navigationGroups.map((group) => (
              <NavGroup key={group.id} group={group} onNavigate={onClose} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 mt-auto">
          {user ? (
            /* Logout button for authenticated users */
            <Button
              variant="ghost"
              onClick={() => {
                onLogout?.()
                onClose()
              }}
              className="w-full justify-start gap-4 px-4 py-4 h-auto text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
            >
              <LogOut className="h-6 w-6" />
              <span className="text-base font-medium">Log out</span>
            </Button>
          ) : (
            /* Auth CTAs for unauthenticated users */
            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-base font-medium"
              >
                <Link href="/signup" onClick={onClose}>
                  Sign Up
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-base font-medium"
              >
                <Link href="/login" onClick={onClose}>
                  Log In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
