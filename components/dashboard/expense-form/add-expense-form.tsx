"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense"
import { addExpense } from "@/app/actions/expenses"
import { useFormAction } from "@/lib/hooks"
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

const DEFAULT_VALUES: ExpenseFormData = {
  date: new Date(),
  category: undefined as unknown as ExpenseFormData["category"],
  amount: undefined as unknown as number,
  description: "",
}

/**
 * Form component for adding new expenses.
 * Uses React Hook Form with Zod validation and server actions.
 */
export function AddExpenseForm() {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { execute, isLoading } = useFormAction(addExpense, {
    successMessage: "Expense added successfully!",
    refreshOnSuccess: true,
    onSuccess: () => {
      form.reset(DEFAULT_VALUES)
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    await execute(data)
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
          render={({ field, fieldState }) => (
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
                  hasError={!!fieldState.error}
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
          render={({ field, fieldState }) => (
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
                  hasError={!!fieldState.error}
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
