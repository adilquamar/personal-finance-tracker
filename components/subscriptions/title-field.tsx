"use client"

import { useFormContext } from "react-hook-form"
import type { SubscriptionFormData } from "@/lib/validations/subscription"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface TitleFieldProps {
  disabled: boolean
}

export function TitleField({ disabled }: TitleFieldProps) {
  const { control } = useFormContext<SubscriptionFormData>()

  return (
    <FormField
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Title
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="e.g., Netflix, Cursor Pro"
              disabled={disabled}
              hasError={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
