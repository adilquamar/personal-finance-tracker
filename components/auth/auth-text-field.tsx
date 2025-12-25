"use client"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"

interface AuthTextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  disabled?: boolean
  autoComplete?: string
  type?: "text" | "email" | "tel"
}

export function AuthTextField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  autoComplete,
  type = "text",
}: AuthTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl>
            <input
              type={type}
              autoComplete={autoComplete}
              disabled={disabled}
              {...field}
              className={cn(
                "flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm",
                "placeholder:text-gray-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-indigo-300",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-150",
                fieldState.error
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : "border-gray-200"
              )}
            />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  )
}

