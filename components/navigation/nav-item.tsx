"use client"

import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSharedNavigation } from "@/lib/contexts"
import { cn } from "@/lib/utils"
import type { NavItem as NavItemType } from "@/lib/config/navigation"

interface NavItemProps {
  item: NavItemType
  onNavigate?: () => void
}

export function NavItem({ item, onNavigate }: NavItemProps) {
  const pathname = usePathname()
  const { navigate, isNavigating } = useSharedNavigation()
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
  const isLoading = isNavigating(item.href)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Close the nav drawer
    onNavigate?.()
    // Navigate with transition tracking
    navigate(item.href)
  }

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-colors",
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-700 hover:bg-gray-50",
        isLoading && "opacity-70 pointer-events-none"
      )}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 flex-shrink-0 animate-spin" />
      ) : (
        <item.icon className="h-6 w-6 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{item.label}</span>
          {item.badge && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </a>
  )
}

