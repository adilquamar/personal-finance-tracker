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
import { DatePickerField } from "@/components/dashboard/expense-form"
import { dateFromDay } from "@/lib/utils/subscription"
import { getOrdinal } from "@/lib/utils/format"
import { cn } from "@/lib/utils"

/** Days 1-31 for the monthly billing day select */
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1)

interface BillingDateFieldProps {
  disabled: boolean
}

export function BillingDateField({ disabled }: BillingDateFieldProps) {
  const { control, watch } = useFormContext<SubscriptionFormData>()
  const recurrence = watch("recurrence")

  if (!recurrence) return null

  return (
    <FormField
      control={control}
      name="billing_anchor_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            {recurrence === "monthly" ? "Day of Month" : "Billing Date"}
          </FormLabel>
          <FormControl>
            {recurrence === "monthly" ? (
              <Select
                value={
                  field.value ? String(field.value.getDate()) : undefined
                }
                onValueChange={(val) => {
                  field.onChange(dateFromDay(Number(val)))
                }}
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
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_MONTH.map((day) => (
                    <SelectItem
                      key={day}
                      value={String(day)}
                      className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                    >
                      {getOrdinal(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <DatePickerField
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                placeholder="Select billing date"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
