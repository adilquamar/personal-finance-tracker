"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatDateLabel } from "@/lib/utils/date-range"
import { formatCurrency } from "@/lib/utils/format"
import { parseISO } from "date-fns"
import { ContentCard } from "@/components/ui/content-card"
import type { SpendingTrendPoint } from "@/types/analytics"

interface SpendingChartProps {
  /** Array of spending data points */
  data: SpendingTrendPoint[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Custom tooltip component for the spending chart
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload || !payload.length || !label) {
    return null
  }

  const date = parseISO(label)
  const amount = payload[0].value

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-gray-900">
        {formatDateLabel(date)}
      </p>
      <p className="text-sm text-indigo-600">{formatCurrency(amount)}</p>
    </div>
  )
}

/**
 * Formats X-axis tick labels from date string to "Dec 12" format
 */
function formatXAxisTick(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return formatDateLabel(date)
  } catch {
    return dateString
  }
}

/**
 * Formats Y-axis tick labels as currency (abbreviated)
 */
function formatYAxisTick(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return `$${value}`
}

/**
 * Spending trend line chart showing daily spending over time.
 * Displays a line chart with dots for each data point and hover tooltips.
 */
export function SpendingChart({ data, className }: SpendingChartProps) {
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <ContentCard className={className}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Spending Trend
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No spending data for this period</p>
        </div>
      </ContentCard>
    )
  }

  // Calculate Y-axis domain with some padding
  const maxAmount = Math.max(...data.map((d) => d.amount))
  const yAxisMax = Math.ceil(maxAmount * 1.2 / 50) * 50 || 100 // Round up to nearest 50

  // Determine tick interval for X-axis based on data length
  const xAxisInterval = data.length > 14 ? Math.floor(data.length / 7) : 0

  return (
    <ContentCard className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Spending Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval={xAxisInterval}
              dy={10}
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, yAxisMax]}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{
                fill: "#6366f1",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#6366f1",
                strokeWidth: 0,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ContentCard>
  )
}
