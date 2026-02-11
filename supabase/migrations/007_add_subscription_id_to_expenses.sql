-- Add optional subscription_id to expenses for traceability + cron idempotency
ALTER TABLE expenses
  ADD COLUMN subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL;

CREATE INDEX idx_expenses_subscription_id ON expenses(subscription_id);
