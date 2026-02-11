/**
 * Formats a number as USD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Returns a day number with its ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
 */
export function getOrdinal(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const mod100 = day % 100
  const suffix =
    mod100 >= 11 && mod100 <= 13 ? "th" : suffixes[day % 10] || "th"
  return `${day}${suffix}`
}

