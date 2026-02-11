import type { ExpenseCategory } from './expense'
import type { BudgetPeriod } from './budget'
import type { SubscriptionRecurrence } from './subscription'

/**
 * Database type definitions for Supabase client typing.
 * This provides full type safety when querying the database.
 */
export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: ExpenseCategory
          date: string
          title: string
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: ExpenseCategory
          date: string
          title: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: ExpenseCategory
          date?: string
          title?: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'expenses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_subscription_id_fkey'
            columns: ['subscription_id']
            isOneToOne: false
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          }
        ]
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: ExpenseCategory
          period: BudgetPeriod
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: ExpenseCategory
          period: BudgetPeriod
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: ExpenseCategory
          period?: BudgetPeriod
          amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'budgets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          category: ExpenseCategory
          recurrence: SubscriptionRecurrence
          billing_anchor_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          category: ExpenseCategory
          recurrence: SubscriptionRecurrence
          billing_anchor_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          category?: ExpenseCategory
          recurrence?: SubscriptionRecurrence
          billing_anchor_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      expense_category: ExpenseCategory
      budget_period: BudgetPeriod
      subscription_recurrence: SubscriptionRecurrence
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Helper type for accessing table row types
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

/**
 * Helper type for insert operations
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

/**
 * Helper type for update operations
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

/**
 * Helper type for accessing enum types
 */
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

