"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AmountInputFieldProps {
  /** Current amount value */
  value?: number
  /** Callback when amount changes */
  onChange: (amount: number | undefined) => void
  /** Whether the field is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Additional class names for the container */
  className?: string
}

/**
 * A numeric input field for expense amounts with currency prefix.
 * Restricts input to valid decimal numbers with max 2 decimal places.
 * Designed for use with React Hook Form via Controller or FormField.
 */
export function AmountInputField({
  value,
  onChange,
  disabled = false,
  placeholder = "0.00",
  className,
}: AmountInputFieldProps) {
  // Track the display value as string to allow intermediate states like "12."
  const [displayValue, setDisplayValue] = React.useState<string>(
    value !== undefined ? value.toString() : ""
  )

  // Sync display value when external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value.toString())
    } else {
      setDisplayValue("")
    }
  }, [value])

  /**
   * Validates and restricts input to valid decimal numbers
   * Allows: digits, single decimal point, max 2 decimal places
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("")
      onChange(undefined)
      return
    }

    // Regex: optional digits, optional decimal point, max 2 decimal digits
    const validPattern = /^\d*\.?\d{0,2}$/

    if (!validPattern.test(inputValue)) {
      return // Reject invalid input
    }

    setDisplayValue(inputValue)

    // Parse and send to onChange only if it's a valid number
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue)) {
      onChange(numValue)
    } else if (inputValue === ".") {
      // Allow starting with decimal point, but don't update numeric value yet
      onChange(undefined)
    }
  }

  /**
   * Handles keyboard events to prevent non-numeric input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ]

    if (allowedKeys.includes(e.key)) {
      return
    }

    // Allow Ctrl/Cmd + A, C, V, X
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return
    }

    // Allow digits
    if (/^\d$/.test(e.key)) {
      return
    }

    // Allow single decimal point if not already present
    if (e.key === "." && !displayValue.includes(".")) {
      return
    }

    // Prevent all other keys
    e.preventDefault()
  }

  /**
   * Format display on blur (e.g., "5" becomes "5.00")
   */
  const handleBlur = () => {
    if (displayValue === "" || displayValue === ".") {
      return
    }

    const numValue = parseFloat(displayValue)
    if (!isNaN(numValue)) {
      // Keep the display simple - don't force .00 format
      setDisplayValue(numValue.toString())
    }
  }

  return (
    <div className={cn("relative", className)}>
      <span
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none",
          disabled && "opacity-50"
        )}
      >
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-4 text-base text-gray-900",
          "placeholder:text-gray-400",
          "hover:border-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
        )}
      />
    </div>
  )
}

