"use client"

import { Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/format"
import { useIsMobile } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BudgetProgressBar } from "./budget-progress-bar"

import type { BudgetWithSpending } from "@/types/budget"
import { BUDGET_PERIOD_LABELS } from "@/types/budget"
import { EXPENSE_CATEGORY_LABELS } from "@/types/expense"

interface BudgetTableProps {
  budgets: BudgetWithSpending[]
  onEdit?: (budget: BudgetWithSpending) => void
  onDelete?: (budget: BudgetWithSpending) => void
}

// ─── Mobile Card Layout ──────────────────────────────────────────────

function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: BudgetWithSpending
  onEdit?: (budget: BudgetWithSpending) => void
  onDelete?: (budget: BudgetWithSpending) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header: Category + Period badge + Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {EXPENSE_CATEGORY_LABELS[budget.category]}
          </span>
          <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
            {BUDGET_PERIOD_LABELS[budget.period]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(budget)}
              aria-label={`Edit ${EXPENSE_CATEGORY_LABELS[budget.category]} budget`}
            >
              <Pencil size={16} className="text-gray-400" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(budget)}
              aria-label={`Delete ${EXPENSE_CATEGORY_LABELS[budget.category]} budget`}
            >
              <Trash2 size={16} className="text-red-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Amounts row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(budget.amount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(budget.spent)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p
            className={cn(
              "text-sm font-medium",
              budget.remaining >= 0 ? "text-green-600" : "text-red-500"
            )}
          >
            {formatCurrency(budget.remaining)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <BudgetProgressBar
        spent={budget.spent}
        budget={budget.amount}
        percentUsed={budget.percentUsed}
        showLabels={false}
        size="sm"
      />
    </div>
  )
}

// ─── Desktop Table Layout ────────────────────────────────────────────

function BudgetDesktopTable({
  budgets,
  onEdit,
  onDelete,
}: BudgetTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Period</TableHead>
          <TableHead className="text-right">Budget</TableHead>
          <TableHead className="text-right">Spent</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
          <TableHead className="w-[180px]">Progress</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget.id}>
            {/* Category */}
            <TableCell className="font-medium text-gray-900">
              {EXPENSE_CATEGORY_LABELS[budget.category]}
            </TableCell>

            {/* Period badge */}
            <TableCell>
              <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                {BUDGET_PERIOD_LABELS[budget.period]}
              </span>
            </TableCell>

            {/* Budget amount */}
            <TableCell className="text-right text-gray-700">
              {formatCurrency(budget.amount)}
            </TableCell>

            {/* Spent amount */}
            <TableCell className="text-right text-gray-700">
              {formatCurrency(budget.spent)}
            </TableCell>

            {/* Remaining — green if positive, red if negative */}
            <TableCell
              className={cn(
                "text-right font-medium",
                budget.remaining >= 0 ? "text-green-600" : "text-red-500"
              )}
            >
              {formatCurrency(budget.remaining)}
            </TableCell>

            {/* Progress bar */}
            <TableCell>
              <BudgetProgressBar
                spent={budget.spent}
                budget={budget.amount}
                percentUsed={budget.percentUsed}
                showLabels={false}
                size="sm"
              />
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(budget)}
                    aria-label={`Edit ${EXPENSE_CATEGORY_LABELS[budget.category]} budget`}
                  >
                    <Pencil size={16} className="text-gray-400" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(budget)}
                    aria-label={`Delete ${EXPENSE_CATEGORY_LABELS[budget.category]} budget`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export function BudgetTable({ budgets, onEdit, onDelete }: BudgetTableProps) {
  const isMobile = useIsMobile()

  if (budgets.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">
          No budgets set yet. Add a budget to start tracking your spending.
        </p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <BudgetDesktopTable
      budgets={budgets}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
