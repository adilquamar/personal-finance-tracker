"use client"

import { validateMonthlyYearlyConsistency } from "@/lib/validations/budget"
import { formatCurrency } from "@/lib/utils/format"
import { BUDGET_PERIOD_LABELS, type Budget, type BudgetPeriod } from "@/types/budget"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface CrossValidationWarningProps {
  /** The existing complementary budget (opposite period) */
  complementary: Budget
  /** The period currently selected in the form */
  currentPeriod: BudgetPeriod
  /** The amount currently entered in the form */
  currentAmount: number | undefined
  /** Callback to auto-fill the suggested amount */
  onAutoFill: (amount: number) => void
}

/**
 * Displays a warning when a complementary budget exists for the same category.
 *
 * Shows the existing budget, validates monthly*12 === yearly consistency,
 * and offers an auto-fill button with the suggested amount.
 */
export function CrossValidationWarning({
  complementary,
  currentPeriod,
  currentAmount,
  onAutoFill,
}: CrossValidationWarningProps) {
  const suggestedAmount =
    currentPeriod === "yearly"
      ? Math.round(complementary.amount * 12 * 100) / 100
      : Math.round((complementary.amount / 12) * 100) / 100

  const complementaryLabel =
    BUDGET_PERIOD_LABELS[complementary.period].toLowerCase()

  const hasMismatch =
    currentAmount !== undefined && currentAmount !== suggestedAmount

  const validation =
    currentAmount !== undefined
      ? currentPeriod === "yearly"
        ? validateMonthlyYearlyConsistency(complementary.amount, currentAmount)
        : validateMonthlyYearlyConsistency(currentAmount, complementary.amount)
      : null

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg p-3 text-sm",
        hasMismatch && validation && !validation.valid
          ? "bg-amber-50 text-amber-800"
          : "bg-indigo-50 text-indigo-700"
      )}
    >
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1">
        <p>
          This category has a {complementaryLabel} budget of{" "}
          <span className="font-medium">
            {formatCurrency(complementary.amount)}
          </span>
          .
        </p>
        {hasMismatch && validation && !validation.valid ? (
          <p className="text-amber-700">{validation.message}</p>
        ) : null}
        <button
          type="button"
          className="text-indigo-600 font-medium hover:text-indigo-700 underline underline-offset-2 transition-colors"
          onClick={() => onAutoFill(suggestedAmount)}
        >
          Auto-fill {formatCurrency(suggestedAmount)}
        </button>
      </div>
    </div>
  )
}
