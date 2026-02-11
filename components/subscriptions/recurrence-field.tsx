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
  SUBSCRIPTION_RECURRENCES,
  SUBSCRIPTION_RECURRENCE_LABELS,
} from "@/types/subscription"
import { cn } from "@/lib/utils"

interface RecurrenceFieldProps {
  disabled: boolean
}

export function RecurrenceField({ disabled }: RecurrenceFieldProps) {
  const { control, setValue } = useFormContext<SubscriptionFormData>()

  return (
    <FormField
      control={control}
      name="recurrence"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Recurrence
          </FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val)
                // Reset billing date when recurrence type changes
                setValue(
                  "billing_anchor_date",
                  undefined as unknown as Date
                )
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
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_RECURRENCES.map((rec) => (
                  <SelectItem
                    key={rec}
                    value={rec}
                    className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                  >
                    {SUBSCRIPTION_RECURRENCE_LABELS[rec]}
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
