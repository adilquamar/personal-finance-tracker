import {
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  Settings,
  HelpCircle,
  CreditCard,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  id: string
  icon: LucideIcon
  label: string
  href: string
  description?: string
  badge?: string | number
  /** Whether this item requires authentication */
  requiresAuth?: boolean
  /** Whether this item is only shown to unauthenticated users */
  guestOnly?: boolean
}

export interface NavGroup {
  id: string
  label?: string
  items: NavItem[]
}

/**
 * Main navigation configuration
 * Add new navigation items here - they will automatically appear in the side nav
 */
export const navigationConfig: NavGroup[] = [
  {
    id: "main",
    items: [
      {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
        description: "Overview of your finances",
      },
      {
        id: "analytics",
        icon: TrendingUp,
        label: "Analytics",
        href: "/analytics",
        description: "Spending trends & insights",
      },
      {
        id: "chatbot",
        icon: MessageSquare,
        label: "AI Chatbot",
        href: "/chatbot",
        description: "Get financial advice",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        id: "billing",
        icon: CreditCard,
        label: "Billing",
        href: "/billing",
        requiresAuth: true,
      },
      {
        id: "settings",
        icon: Settings,
        label: "Settings",
        href: "/settings",
        requiresAuth: true,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      {
        id: "help",
        icon: HelpCircle,
        label: "Help Center",
        href: "/help",
      },
    ],
  },
]

/**
 * Filter navigation items based on auth state
 */
export function getFilteredNavigation(isAuthenticated: boolean): NavGroup[] {
  return navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.requiresAuth && !isAuthenticated) return false
        if (item.guestOnly && isAuthenticated) return false
        return true
      }),
    }))
    .filter((group) => group.items.length > 0)
}

