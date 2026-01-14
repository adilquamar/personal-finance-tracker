"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Size variants for the input
 */
type InputSize = "sm" | "md" | "lg"

const sizeStyles: Record<InputSize, string> = {
  sm: "h-10 px-3 py-2 text-sm",
  md: "h-12 px-4 py-3 text-sm",
  lg: "h-14 px-4 py-3 text-base",
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Whether the input has a validation error
   */
  hasError?: boolean
  /**
   * Size variant of the input
   * @default "md"
   */
  inputSize?: InputSize
}

/**
 * Input component with consistent styling across the app.
 * Used as the foundation for all text inputs including email, password, and text fields.
 *
 * @example
 * // Basic usage
 * <Input type="email" placeholder="Enter email" />
 *
 * @example
 * // With error state
 * <Input hasError={!!errors.email} {...register("email")} />
 *
 * @example
 * // Different sizes
 * <Input inputSize="sm" />
 * <Input inputSize="md" /> // default
 * <Input inputSize="lg" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, inputSize = "md", ...props }, ref) => {
    return (
      <input
        className={cn(
          // Base styles
          "flex w-full rounded-lg border bg-white",
          // Size styles
          sizeStyles[inputSize],
          // Placeholder styles
          "placeholder:text-gray-400",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Transition
          "transition-all duration-150",
          // Error state vs normal state
          hasError
            ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
            : "border-gray-200 focus-visible:ring-indigo-300 focus-visible:border-indigo-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
