"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { budgetSchema, type BudgetFormData } from "@/lib/validations/budget"
import { upsertBudget } from "@/app/actions/budget"
import { useFormAction } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/types/expense"
import {
  BUDGET_PERIODS,
  BUDGET_PERIOD_LABELS,
  type Budget,
} from "@/types/budget"
import { BudgetAmountField } from "./budget-amount-field"
import { CrossValidationWarning } from "./budget-cross-validation-warning"
import {
  DEFAULT_VALUES,
  getUsedCategories,
  findComplementaryBudget,
} from "@/lib/utils/budget"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BudgetFormContentProps {
  /** Budget to edit – when provided the form is in edit mode */
  editBudget?: Budget | null
  /** All existing budgets for the user, used for filtering & cross-validation */
  existingBudgets: Budget[]
  /** Called after a successful submission */
  onSuccess: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * The inner form used by BudgetFormDialog.
 *
 * Sets up React Hook Form + Zod + useFormAction and renders the
 * Period / Category / Amount fields with cross-validation.
 */
export function BudgetFormContent({
  editBudget,
  existingBudgets,
  onSuccess,
}: BudgetFormContentProps) {
  const isEditing = !!editBudget

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: isEditing
      ? {
          category: editBudget.category,
          period: editBudget.period,
          amount: editBudget.amount,
        }
      : DEFAULT_VALUES,
  })

  const { execute, isLoading } = useFormAction(upsertBudget, {
    successMessage: isEditing
      ? "Budget updated successfully!"
      : "Budget created successfully!",
    refreshOnSuccess: true,
    onSuccess: () => {
      form.reset(DEFAULT_VALUES)
      onSuccess()
    },
  })

  // Watch fields for cross-validation and category filtering
  const watchedPeriod = form.watch("period")
  const watchedCategory = form.watch("category")
  const watchedAmount = form.watch("amount")

  // Compute filtered categories based on the selected period
  const usedCategories = React.useMemo(
    () => getUsedCategories(existingBudgets, watchedPeriod, editBudget),
    [existingBudgets, watchedPeriod, editBudget]
  )

  const availableCategories = React.useMemo(
    () => EXPENSE_CATEGORIES.filter((c) => !usedCategories.has(c)),
    [usedCategories]
  )

  // Find complementary budget for cross-validation
  const complementaryBudget = React.useMemo(
    () =>
      findComplementaryBudget(
        existingBudgets,
        watchedCategory,
        watchedPeriod,
        editBudget
      ),
    [existingBudgets, watchedCategory, watchedPeriod, editBudget]
  )

  // When period changes in create mode, clear category if it's now taken
  React.useEffect(() => {
    if (isEditing) return
    const currentCategory = form.getValues("category")
    if (currentCategory && usedCategories.has(currentCategory)) {
      form.setValue("category", undefined as unknown as ExpenseCategory)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPeriod, isEditing])

  const handleAutoFill = React.useCallback(
    (amount: number) => {
      form.setValue("amount", amount, { shouldValidate: true })
    },
    [form]
  )

  const onSubmit = async (data: BudgetFormData) => {
    await execute(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Period Field */}
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Period
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={isLoading || isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_PERIODS.map((period) => (
                      <SelectItem key={period} value={period}>
                        {BUDGET_PERIOD_LABELS[period]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={isLoading || isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(isEditing ? EXPENSE_CATEGORIES : availableCategories).map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {EXPENSE_CATEGORY_LABELS[category]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              {!isEditing &&
                watchedPeriod &&
                availableCategories.length === 0 && (
                  <p className="text-sm text-gray-500">
                    All categories already have a{" "}
                    {BUDGET_PERIOD_LABELS[watchedPeriod].toLowerCase()} budget.
                  </p>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

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
                <BudgetAmountField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cross-validation warning */}
        {complementaryBudget && watchedCategory && watchedPeriod && (
          <CrossValidationWarning
            complementary={complementaryBudget}
            currentPeriod={watchedPeriod}
            currentAmount={watchedAmount}
            onAutoFill={handleAutoFill}
          />
        )}

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
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Budget"
              : "Create Budget"}
        </Button>
      </form>
    </Form>
  )
}
