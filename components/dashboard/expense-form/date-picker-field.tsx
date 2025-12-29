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

interface DatePickerFieldProps {
  /** Currently selected date */
  value?: Date
  /** Callback when date is selected */
  onChange: (date: Date | undefined) => void
  /** Whether the field is disabled */
  disabled?: boolean
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Additional class names for the trigger button */
  className?: string
}

/**
 * A date picker field component using Shadcn Popover and Calendar.
 * Designed for use with React Hook Form via Controller or FormField.
 */
export function DatePickerField({
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  className,
}: DatePickerFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-12 w-full justify-start rounded-lg border-gray-200 bg-white px-4 text-left font-normal",
            "hover:bg-gray-50 hover:border-gray-300",
            "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-gray-400",
            className
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
          {value ? (
            <span className="text-gray-900">{format(value, "MMM d, yyyy")}</span>
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
  )
}

