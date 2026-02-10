/**
 * Default monthly budget fallback.
 *
 * Budgets are now user-configurable via the `budgets` table (per-category,
 * per-period). This constant is kept as a fallback default for analytics
 * pages that reference a global budget until those pages are updated to
 * use per-category budgets from the database.
 */
export const DEFAULT_BUDGET = 3000
