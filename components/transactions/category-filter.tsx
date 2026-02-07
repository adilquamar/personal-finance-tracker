"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/types/expense"

/**
 * Label shown for the "all categories" option (no filter applied)
 */
export const ALL_CATEGORIES_LABEL = "All"

interface CategoryFilterProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Category filter selector with URL search param state management.
 * Updates the URL with ?category=food|transportation|... on selection.
 * Default is no category (show all), displayed as a dash "–".
 */
export function CategoryFilter({ className }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current category from URL params (null means "all")
  const currentCategory = searchParams.get("category") as ExpenseCategory | null

  const handleCategoryChange = useCallback(
    (category: ExpenseCategory | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (category) {
        params.set("category", category)
      } else {
        params.delete("category")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Filter by category"
    >
      {/* "All" option shown as a dash */}
      <button
        type="button"
        onClick={() => handleCategoryChange(null)}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
          !currentCategory
            ? "bg-indigo-50 text-indigo-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
        aria-pressed={!currentCategory}
      >
        {ALL_CATEGORIES_LABEL}
      </button>

      {EXPENSE_CATEGORIES.map((category) => {
        const isActive = currentCategory === category

        return (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryChange(category)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            aria-pressed={isActive}
          >
            {EXPENSE_CATEGORY_LABELS[category]}
          </button>
        )
      })}
    </div>
  )
}
