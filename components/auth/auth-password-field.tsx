"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { PasswordInput } from "./password-input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"

interface AuthPasswordFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled?: boolean
  /** Show "Forgot password?" link (for login form) */
  showForgotLink?: boolean
  /** Label text (defaults to "Password") */
  label?: string
  /** autocomplete attribute (e.g., "current-password" or "new-password") */
  autoComplete?: string
}

export function AuthPasswordField<T extends FieldValues>({
  control,
  name,
  disabled,
  showForgotLink = false,
  label = "Password",
  autoComplete = "current-password",
}: AuthPasswordFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium text-gray-700">
              {label}
            </FormLabel>
            {showForgotLink && (
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <FormControl>
            <PasswordInput
              autoComplete={autoComplete}
              disabled={disabled}
              {...field}
              className={cn(
                fieldState.error
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              )}
            />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  )
}

