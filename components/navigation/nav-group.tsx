"use client"

import { NavItem } from "./nav-item"
import type { NavGroup as NavGroupType } from "@/lib/config/navigation"

interface NavGroupProps {
  group: NavGroupType
  onNavigate?: () => void
}

export function NavGroup({ group, onNavigate }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {group.label && (
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {group.label}
        </h3>
      )}
      {group.items.map((item) => (
        <NavItem key={item.id} item={item} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

