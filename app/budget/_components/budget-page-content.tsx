"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BudgetTable } from "@/components/budget/budget-table"
import { BudgetFormDialog } from "@/components/budget/budget-form-dialog"
import { deleteBudget } from "@/app/actions/budget"
import { useFormAction } from "@/lib/hooks/use-form-action"
import type { BudgetWithSpending } from "@/types/budget"

interface BudgetPageContentProps {
  budgets: BudgetWithSpending[]
}

/**
 * Client component that manages the interactive state for the budget table
 * and the add/edit form dialog. The server component (page.tsx) handles
 * data fetching and passes budgets as props.
 */
export function BudgetPageContent({ budgets }: BudgetPageContentProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editBudget, setEditBudget] = React.useState<BudgetWithSpending | null>(
    null
  )

  const handleEdit = React.useCallback((budget: BudgetWithSpending) => {
    setEditBudget(budget)
    setDialogOpen(true)
  }, [])

  const { execute: executeDelete } = useFormAction(deleteBudget, {
    successMessage: "Budget deleted successfully!",
    refreshOnSuccess: true,
  })

  const handleDelete = React.useCallback(
    async (budget: BudgetWithSpending) => {
      await executeDelete({ id: budget.id })
    },
    [executeDelete]
  )

  const handleOpenChange = React.useCallback((open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditBudget(null)
  }, [])

  return (
    <>
      <BudgetTable
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Budget
        </Button>
      </div>

      <BudgetFormDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        editBudget={editBudget}
        existingBudgets={budgets}
      />
    </>
  )
}
