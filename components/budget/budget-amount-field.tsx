"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface BudgetAmountFieldProps {
  /** Current amount value */
  value?: number
  /** Callback when amount changes */
  onChange: (amount: number | undefined) => void
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field has a validation error */
  hasError?: boolean
}

/**
 * A numeric input field for budget amounts with a currency ($) prefix.
 * Restricts input to valid decimal numbers with max 2 decimal places.
 * Designed for use with React Hook Form via FormField.
 */
export function BudgetAmountField({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: BudgetAmountFieldProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(
    value !== undefined ? value.toString() : ""
  )

  // Sync display when external value changes (e.g. auto-fill)
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value.toString())
    } else {
      setDisplayValue("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === "") {
      setDisplayValue("")
      onChange(undefined)
      return
    }

    // Allow digits, single decimal point, max 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(inputValue)) return

    setDisplayValue(inputValue)
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue)) {
      onChange(numValue)
    } else if (inputValue === ".") {
      onChange(undefined)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    if (allowedKeys.includes(e.key)) return
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    )
      return
    if (/^\d$/.test(e.key)) return
    if (e.key === "." && !displayValue.includes(".")) return
    e.preventDefault()
  }

  const handleBlur = () => {
    if (displayValue === "" || displayValue === ".") return
    const numValue = parseFloat(displayValue)
    if (!isNaN(numValue)) setDisplayValue(numValue.toString())
  }

  return (
    <div className="relative">
      <span
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none",
          disabled && "opacity-50"
        )}
      >
        $
      </span>
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="0.00"
        hasError={hasError}
        className="pl-8"
      />
    </div>
  )
}
