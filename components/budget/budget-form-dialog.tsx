"use client"

import * as React from "react"
import { useIsMobile } from "@/lib/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { Budget } from "@/types/budget"
import { BudgetFormContent } from "./budget-form-content"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BudgetFormDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback to change open state */
  onOpenChange: (open: boolean) => void
  /** Budget to edit – when provided the form is in edit mode */
  editBudget?: Budget | null
  /** All existing budgets for the user, used for filtering & cross-validation */
  existingBudgets?: Budget[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Budget form dialog component.
 *
 * Renders as a centered Dialog on desktop and a bottom Sheet on mobile.
 * Delegates all form logic to {@link BudgetFormContent}.
 */
export function BudgetFormDialog({
  open,
  onOpenChange,
  editBudget,
  existingBudgets = [],
}: BudgetFormDialogProps) {
  const isMobile = useIsMobile()
  const isEditing = !!editBudget

  const title = isEditing ? "Edit Budget" : "Add Budget"
  const description = isEditing
    ? "Update the budget amount for this category."
    : "Set a spending budget for a category."

  const handleSuccess = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Key ensures form state resets between different budgets / create mode
  const formContent = (
    <BudgetFormContent
      key={editBudget?.id ?? "create"}
      editBudget={editBudget}
      existingBudgets={existingBudgets}
      onSuccess={handleSuccess}
    />
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
          <SheetHeader className="text-left mb-5">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
