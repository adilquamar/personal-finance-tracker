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
            <Input
              type="email"
              autoComplete="email"
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

