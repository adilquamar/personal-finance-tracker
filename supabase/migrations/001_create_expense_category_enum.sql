-- Migration: Create expense_category enum
-- Description: Defines the predefined expense categories for the finance tracker

CREATE TYPE expense_category AS ENUM (
  'food',
  'transportation',
  'entertainment',
  'shopping',
  'bills',
  'healthcare',
  'other'
);

COMMENT ON TYPE expense_category IS 'Predefined categories for expense classification';

