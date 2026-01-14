"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
            <Input
              type={type}
              autoComplete={autoComplete}
              disabled={disabled}
              hasError={!!fieldState.error}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  )
}

