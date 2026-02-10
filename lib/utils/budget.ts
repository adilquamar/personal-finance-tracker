import type { ExpenseCategory } from "@/types/expense"
import type { Budget, BudgetPeriod } from "@/types/budget"
import type { BudgetFormData } from "@/lib/validations/budget"

/**
 * Default (empty) form values for the budget form.
 */
export const DEFAULT_VALUES: BudgetFormData = {
  category: undefined as unknown as ExpenseCategory,
  period: undefined as unknown as BudgetPeriod,
  amount: undefined as unknown as number,
}

/**
 * Returns categories that already have a budget for the given period,
 * excluding the category of the budget currently being edited.
 */
export function getUsedCategories(
  existingBudgets: Budget[],
  period: BudgetPeriod | undefined,
  editBudget?: Budget | null
): Set<ExpenseCategory> {
  if (!period) return new Set()

  return new Set(
    existingBudgets
      .filter(
        (b) =>
          b.period === period &&
          !(editBudget && b.id === editBudget.id)
      )
      .map((b) => b.category)
  )
}

/**
 * Finds a complementary budget (opposite period) for a given category.
 * If the user is setting a yearly budget, returns the existing monthly one,
 * and vice-versa.
 */
export function findComplementaryBudget(
  existingBudgets: Budget[],
  category: ExpenseCategory | undefined,
  period: BudgetPeriod | undefined,
  editBudget?: Budget | null
): Budget | undefined {
  if (!category || !period) return undefined

  const oppositePeriod: BudgetPeriod =
    period === "monthly" ? "yearly" : "monthly"

  return existingBudgets.find(
    (b) =>
      b.category === category &&
      b.period === oppositePeriod &&
      !(editBudget && b.id === editBudget.id)
  )
}
