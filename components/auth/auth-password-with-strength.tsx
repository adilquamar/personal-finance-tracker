"use client"

import { cn } from "@/lib/utils"
import { PasswordInput } from "./password-input"
import { PasswordCheck } from "./password-check"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { Control, FieldValues, Path } from "react-hook-form"

interface AuthPasswordWithStrengthProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled?: boolean
  /** The current password value (from form.watch) */
  password: string
}

export function AuthPasswordWithStrength<T extends FieldValues>({
  control,
  name,
  disabled,
  password,
}: AuthPasswordWithStrengthProps<T>) {
  // Password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            Password
          </FormLabel>
          <FormControl>
            <PasswordInput
              autoComplete="new-password"
              disabled={disabled}
              {...field}
              className={cn(
                fieldState.error
                  ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                  : ""
              )}
            />
          </FormControl>

          {/* Password Strength Indicators */}
          {password.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <PasswordCheck passed={passwordChecks.length} text="At least 8 characters" />
              <PasswordCheck passed={passwordChecks.uppercase} text="One uppercase letter" />
              <PasswordCheck passed={passwordChecks.lowercase} text="One lowercase letter" />
              <PasswordCheck passed={passwordChecks.number} text="One number" />
            </div>
          )}

          {!password && <FormMessage className="text-sm text-red-500" />}
        </FormItem>
      )}
    />
  )
}

