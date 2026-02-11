import type { ExpenseCategory } from './expense'

/**
 * Subscription recurrence enum matching the PostgreSQL subscription_recurrence type
 */
export type SubscriptionRecurrence = 'monthly' | 'yearly'

/**
 * Array of all subscription recurrences for iteration/validation
 */
export const SUBSCRIPTION_RECURRENCES: SubscriptionRecurrence[] = ['monthly', 'yearly']

/**
 * Display labels for subscription recurrences
 */
export const SUBSCRIPTION_RECURRENCE_LABELS: Record<SubscriptionRecurrence, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
}

/**
 * Subscription record matching the database schema
 */
export interface Subscription {
  id: string
  user_id: string
  title: string
  amount: number
  category: ExpenseCategory
  recurrence: SubscriptionRecurrence
  billing_anchor_date: string  // YYYY-MM-DD
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Data required to create a new subscription
 */
export interface CreateSubscriptionInput {
  title: string
  amount: number
  category: ExpenseCategory
  recurrence: SubscriptionRecurrence
  billing_anchor_date: string
}

/**
 * Data for updating an existing subscription
 */
export interface UpdateSubscriptionInput {
  title?: string
  amount?: number
  category?: ExpenseCategory
  recurrence?: SubscriptionRecurrence
  billing_anchor_date?: string
  is_active?: boolean
}

/**
 * Enriched type for the page view
 */
export interface SubscriptionWithStatus extends Subscription {
  status: 'paid' | 'upcoming'
  next_billing_date: string  // YYYY-MM-DD of next occurrence
}
