"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the lunar cycle
const lunarCycleData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  mood: Math.floor(Math.random() * 5) + 4, // Random value between 4-9
  productivity: Math.floor(Math.random() * 5) + 3, // Random value between 3-8
}))

export function LunarCycleChart() {
  return (
    <ChartContainer
      config={{
        mood: {
          label: "Mood",
          color: "hsl(var(--chart-1))",
        },
        productivity: {
          label: "Productivity",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lunarCycleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" label={{ value: "Moon Day", position: "insideBottomRight", offset: -10 }} />
          <YAxis label={{ value: "Rating (1-10)", angle: -90, position: "insideLeft" }} domain={[0, 10]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" activeDot={{ r: 8 }} name="Mood" />
          <Line type="monotone" dataKey="productivity" stroke="var(--color-productivity)" name="Productivity" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

