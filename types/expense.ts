/**
 * Expense category enum matching the PostgreSQL expense_category type
 */
export type ExpenseCategory =
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'healthcare'
  | 'other'

/**
 * Array of all expense categories for iteration/validation
 */
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food',
  'transportation',
  'entertainment',
  'shopping',
  'bills',
  'healthcare',
  'other',
]

/**
 * Display labels for expense categories
 */
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food',
  transportation: 'Transportation',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  bills: 'Bills',
  healthcare: 'Healthcare',
  other: 'Other',
}

/**
 * Expense record matching the database schema
 */
export interface Expense {
  id: string
  user_id: string
  amount: number
  category: ExpenseCategory
  date: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Data required to create a new expense
 */
export interface CreateExpenseInput {
  amount: number
  category: ExpenseCategory
  date: string
  description?: string | null
}

/**
 * Data for updating an existing expense
 */
export interface UpdateExpenseInput {
  amount?: number
  category?: ExpenseCategory
  date?: string
  description?: string | null
}

