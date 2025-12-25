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

interface AuthEmailFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled?: boolean
}

export function AuthEmailField<T extends FieldValues>({
  control,
  name,
  disabled,
}: AuthEmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Email
          </FormLabel>
          <FormControl>
            <input
              type="email"
              autoComplete="email"
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

