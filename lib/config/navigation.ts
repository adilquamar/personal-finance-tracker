import {
  LayoutDashboard,
  Receipt,
  RefreshCw,
  Wallet,
  TrendingUp,
  MessageSquare,
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
        id: "transactions",
        icon: Receipt,
        label: "Transactions",
        href: "/transactions",
        description: "View your transaction history",
      },
      {
        id: "subscriptions",
        icon: RefreshCw,
        label: "Subscriptions",
        href: "/subscriptions",
        description: "Manage recurring expenses",
      },
      {
        id: "budget",
        icon: Wallet,
        label: "Budget",
        href: "/budget",
        description: "Manage your spending budgets",
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

