"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartPoint } from "@/types/admin";

interface AnalyticsAreaChartProps {
  data: ChartPoint[];
  dataKey: "revenue" | "orders" | "count";
  color: string;
  valuePrefix?: string;
}

export function AnalyticsAreaChart({ data, dataKey, color, valuePrefix }: AnalyticsAreaChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Not enough data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`chart-fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis
          dataKey="_id"
          tickFormatter={(value: string) => value.slice(5)}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          formatter={(value: number) => [`${valuePrefix ?? ""}${value}`, ""]}
          labelFormatter={(label: string) => label}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#chart-fill-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
