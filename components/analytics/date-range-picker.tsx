"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Matcher } from "react-day-picker"

interface DateRangePickerProps {
  /** Label displayed above the picker */
  label: string
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Currently selected date */
  value?: Date
  /** Callback when date is selected */
  onChange: (date: Date | undefined) => void
  /** Function or matcher to disable specific dates */
  disabled?: Matcher | Matcher[]
  /** Additional CSS classes for the container */
  className?: string
}

/**
 * Formats a date for display as "Dec 12, 2024"
 */
function formatDisplayDate(date: Date): string {
  return format(date, "MMM d, yyyy")
}

/**
 * A labeled date picker component for date range selection.
 * Uses Shadcn Popover and Calendar with indigo accent styling.
 */
export function DateRangePicker({
  label,
  placeholder = "Select date",
  value,
  onChange,
  disabled,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex-1", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-full justify-start rounded-lg border-gray-200 bg-white px-4 text-left font-normal",
              "hover:bg-gray-50 hover:border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
              !value && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
            {value ? (
              <span className="text-gray-900">{formatDisplayDate(value)}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disabled}
            initialFocus
            classNames={{
              day_selected:
                "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-500 focus:text-white",
              day_today: "bg-indigo-50 text-indigo-600",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
