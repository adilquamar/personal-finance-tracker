"use client"

import { useFormContext } from "react-hook-form"
import type { SubscriptionFormData } from "@/lib/validations/subscription"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
} from "@/types/expense"
import { cn } from "@/lib/utils"

interface CategoryFieldProps {
  disabled: boolean
}

export function CategoryField({ disabled }: CategoryFieldProps) {
  const { control } = useFormContext<SubscriptionFormData>()

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Category
          </FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "h-12 w-full rounded-lg border-gray-200 bg-white px-4 text-base",
                  "hover:bg-gray-50 hover:border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  !field.value && "text-gray-400"
                )}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                  >
                    {EXPENSE_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
