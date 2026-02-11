"use client"

import { useFormContext } from "react-hook-form"
import type { SubscriptionFormData } from "@/lib/validations/subscription"
import { AmountInputField } from "@/components/dashboard/expense-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface AmountFieldProps {
  disabled: boolean
}

export function AmountField({ disabled }: AmountFieldProps) {
  const { control } = useFormContext<SubscriptionFormData>()

  return (
    <FormField
      control={control}
      name="amount"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Amount
          </FormLabel>
          <FormControl>
            <AmountInputField
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
              placeholder="0.00"
              hasError={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
