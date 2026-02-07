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
import { ContentCard } from "@/components/ui/content-card"
import { formatCurrency } from "@/lib/utils/format"
import type { MonthlyComparisonPoint } from "@/types/analytics"

interface MonthlySpendingChartProps {
  /** Array of cumulative spending data points */
  data: MonthlyComparisonPoint[]
  /** Additional CSS classes */
  className?: string
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
 * Custom tooltip for the monthly comparison chart
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number | null; dataKey: string }>
  label?: number
}) {
  if (!active || !payload || !payload.length || label == null) {
    return null
  }

  const currentMonth = payload.find((p) => p.dataKey === "currentMonth")
  const lastMonth = payload.find((p) => p.dataKey === "lastMonth")

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-gray-900 mb-1">Day {label}</p>
      {currentMonth?.value != null && (
        <p className="text-sm text-indigo-600">
          This Month: {formatCurrency(currentMonth.value)}
        </p>
      )}
      {lastMonth?.value != null && (
        <p className="text-sm text-gray-500">
          Last Month: {formatCurrency(lastMonth.value)}
        </p>
      )}
    </div>
  )
}

/**
 * Cumulative monthly spending comparison line chart.
 * Shows two lines: current month (indigo) and last month (gray dashed).
 */
export function MonthlySpendingChart({ data, className }: MonthlySpendingChartProps) {
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <ContentCard className={className}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Monthly Spending
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No spending data available</p>
        </div>
      </ContentCard>
    )
  }

  // Calculate Y-axis domain
  const allValues = data.flatMap((d) => [
    d.currentMonth ?? 0,
    d.lastMonth,
  ])
  const maxAmount = Math.max(...allValues, 0)
  const yAxisMax = Math.ceil((maxAmount * 1.2) / 50) * 50 || 100

  return (
    <ContentCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Monthly Spending</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 bg-indigo-500 rounded" />
            <span className="text-gray-600">This Month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 bg-gray-300 rounded border-dashed" style={{ borderTop: "2px dashed #d1d5db", height: 0 }} />
            <span className="text-gray-600">Last Month</span>
          </div>
        </div>
      </div>
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
              dataKey="day"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              ticks={[1, 5, 10, 15, 20, 25, 30]}
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
              dataKey="lastMonth"
              stroke="#d1d5db"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="currentMonth"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ContentCard>
  )
}
