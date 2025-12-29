"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/types/expense"

interface CategorySelectFieldProps {
  /** Currently selected category */
  value?: ExpenseCategory
  /** Callback when category is selected */
  onChange: (category: ExpenseCategory) => void
  /** Whether the field is disabled */
  disabled?: boolean
  /** Placeholder text when no category is selected */
  placeholder?: string
  /** Additional class names for the trigger */
  className?: string
}

/**
 * A category select field component using Shadcn Select.
 * Designed for use with React Hook Form via Controller or FormField.
 */
export function CategorySelectField({
  value,
  onChange,
  disabled = false,
  placeholder = "Select category",
  className,
}: CategorySelectFieldProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as ExpenseCategory)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-12 w-full rounded-lg border-gray-200 bg-white px-4 text-base",
          "hover:bg-gray-50 hover:border-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !value && "text-gray-400",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {EXPENSE_CATEGORIES.map((category) => (
          <SelectItem
            key={category}
            value={category}
            className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
          >
            {EXPENSE_CATEGORY_LABELS[category]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

