-- Migration: Set up Row Level Security policies
-- Description: Ensures users can only access their own expense data

-- Enable Row Level Security on expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own expenses
CREATE POLICY "Users can view their own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can only INSERT expenses with their own user_id
CREATE POLICY "Users can create their own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own expenses
CREATE POLICY "Users can update their own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own expenses
CREATE POLICY "Users can delete their own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

