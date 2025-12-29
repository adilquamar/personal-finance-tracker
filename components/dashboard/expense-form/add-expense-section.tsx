import { Plus } from "lucide-react"
import { AddExpenseForm } from "./add-expense-form"

export function AddExpenseSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Plus className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">Add Expense</h2>
          <p className="text-sm text-gray-500">Track a new transaction</p>
        </div>
      </div>
      <AddExpenseForm />
    </div>
  )
}

