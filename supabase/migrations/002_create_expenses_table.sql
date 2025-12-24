-- Migration: Create expenses table
-- Description: Main table for storing user expenses

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category expense_category NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for common query patterns
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE expenses IS 'User expense records for the personal finance tracker';
COMMENT ON COLUMN expenses.id IS 'Unique identifier for the expense';
COMMENT ON COLUMN expenses.user_id IS 'Reference to the authenticated user';
COMMENT ON COLUMN expenses.amount IS 'Expense amount in user currency (max 12 digits, 2 decimal places)';
COMMENT ON COLUMN expenses.category IS 'Expense category from predefined list';
COMMENT ON COLUMN expenses.date IS 'Date when the expense occurred';
COMMENT ON COLUMN expenses.description IS 'Optional description of the expense';
COMMENT ON COLUMN expenses.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN expenses.updated_at IS 'Timestamp when record was last updated';

