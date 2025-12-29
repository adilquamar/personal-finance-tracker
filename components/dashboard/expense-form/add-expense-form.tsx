"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense"
import { addExpense } from "@/app/actions/expenses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DatePickerField } from "./date-picker-field"
import { CategorySelectField } from "./category-select-field"
import { AmountInputField } from "./amount-input-field"
import { cn } from "@/lib/utils"

/**
 * Form component for adding new expenses.
 * Uses React Hook Form with Zod validation and server actions.
 */
export function AddExpenseForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date(),
      category: undefined,
      amount: undefined,
      description: "",
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true)

    try {
      const result = await addExpense(data)

      if (result.success) {
        toast.success("Expense added successfully!")
        form.reset({
          date: new Date(),
          category: undefined,
          amount: undefined,
          description: "",
        })
        // Trigger data refresh
        router.refresh()
      } else {
        toast.error(result.error || "Failed to add expense")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Date and Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Date
                </FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Category
                </FormLabel>
                <FormControl>
                  <CategorySelectField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Amount
              </FormLabel>
              <FormControl>
                <AmountInputField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Description
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="What was this expense for?"
                  disabled={isLoading}
                  className={cn(
                    "h-12 rounded-lg border-gray-200 bg-white px-4 text-base",
                    "placeholder:text-gray-400",
                    "hover:border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-12 rounded-lg text-base font-medium",
            "bg-indigo-500 text-white",
            "hover:bg-indigo-600",
            "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          {isLoading ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </Form>
  )
}

