"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FoodAnalysisProps {
  personalEntries: any[]
}

export function AdminFoodAnalysis({ personalEntries }: FoodAnalysisProps) {
  const [foodMoodData, setFoodMoodData] = useState<any[]>([])
  const [foodProductivityData, setFoodProductivityData] = useState<any[]>([])
  const [foodMoonPhaseData, setFoodMoonPhaseData] = useState<any[]>([])
  const [luckyFoods, setLuckyFoods] = useState<any[]>([])
  const [selectedMoonPhase, setSelectedMoonPhase] = useState("all")
  const [timeRange, setTimeRange] = useState("all")

  // Moon phases for filtering
  const moonPhases = [
    { value: "all", label: "All Moon Phases" },
    { value: "new", label: "New Moon (Days 1-3)" },
    { value: "waxing-crescent", label: "Waxing Crescent (Days 4-7)" },
    { value: "first-quarter", label: "First Quarter (Days 8-11)" },
    { value: "waxing-gibbous", label: "Waxing Gibbous (Days 12-15)" },
    { value: "full", label: "Full Moon (Days 16-18)" },
    { value: "waning-gibbous", label: "Waning Gibbous (Days 19-22)" },
    { value: "last-quarter", label: "Last Quarter (Days 23-26)" },
    { value: "waning-crescent", label: "Waning Crescent (Days 27-30)" },
  ]

  // Time ranges for filtering
  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
    { value: "year", label: "Last Year" },
  ]

  // Process entries to generate food analysis data
  useEffect(() => {
    if (!personalEntries || personalEntries.length === 0) return

    // Filter entries based on selected time range
    let filteredEntries = [...personalEntries]
    if (timeRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      if (timeRange === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (timeRange === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3)
      } else if (timeRange === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1)
      }

      filteredEntries = personalEntries.filter((entry) => new Date(entry.date) >= cutoffDate)
    }

    // Filter entries based on selected moon phase
    if (selectedMoonPhase !== "all") {
      const moonDayRanges: Record<string, number[]> = {
        new: [1, 2, 3],
        "waxing-crescent": [4, 5, 6, 7],
        "first-quarter": [8, 9, 10, 11],
        "waxing-gibbous": [12, 13, 14, 15],
        full: [16, 17, 18],
        "waning-gibbous": [19, 20, 21, 22],
        "last-quarter": [23, 24, 25, 26],
        "waning-crescent": [27, 28, 29, 30],
      }

      const daysInPhase = moonDayRanges[selectedMoonPhase] || []
      filteredEntries = filteredEntries.filter((entry) => daysInPhase.includes(entry.moonDay))
    }

    // Extract all unique food categories
    const allFoods = new Set<string>()
    filteredEntries.forEach((entry) => {
      if (entry.foods) {
        entry.foods.split(", ").forEach((food: string) => allFoods.add(food))
      }
    })

    // Calculate average mood and productivity for each food
    const foodStats: Record<
      string,
      {
        count: number
        totalMood: number
        totalProductivity: number
        byMoonPhase: Record<string, { count: number; totalMood: number; totalProductivity: number }>
      }
    > = {}

    // Initialize food stats
    allFoods.forEach((food) => {
      foodStats[food] = {
        count: 0,
        totalMood: 0,
        totalProductivity: 0,
        byMoonPhase: {
          "New Moon": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Waxing Crescent": { count: 0, totalMood: 0, totalProductivity: 0 },
          "First Quarter": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Waxing Gibbous": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Full Moon": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Waning Gibbous": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Last Quarter": { count: 0, totalMood: 0, totalProductivity: 0 },
          "Waning Crescent": { count: 0, totalMood: 0, totalProductivity: 0 },
        },
      }
    })

    // Process each entry
    filteredEntries.forEach((entry) => {
      if (!entry.foods) return

      // Determine moon phase
      let moonPhase = "Unknown"
      const moonDay = entry.moonDay

      if (moonDay >= 1 && moonDay <= 3) moonPhase = "New Moon"
      else if (moonDay >= 4 && moonDay <= 7) moonPhase = "Waxing Crescent"
      else if (moonDay >= 8 && moonDay <= 11) moonPhase = "First Quarter"
      else if (moonDay >= 12 && moonDay <= 15) moonPhase = "Waxing Gibbous"
      else if (moonDay >= 16 && moonDay <= 18) moonPhase = "Full Moon"
      else if (moonDay >= 19 && moonDay <= 22) moonPhase = "Waning Gibbous"
      else if (moonDay >= 23 && moonDay <= 26) moonPhase = "Last Quarter"
      else if (moonDay >= 27 && moonDay <= 30) moonPhase = "Waning Crescent"

      // Process each food in the entry
      entry.foods.split(", ").forEach((food: string) => {
        foodStats[food].count += 1
        foodStats[food].totalMood += entry.mood
        foodStats[food].totalProductivity += entry.productivity

        // Add to moon phase stats
        foodStats[food].byMoonPhase[moonPhase].count += 1
        foodStats[food].byMoonPhase[moonPhase].totalMood += entry.mood
        foodStats[food].byMoonPhase[moonPhase].totalProductivity += entry.productivity
      })
    })

    // Convert to chart data format
    const moodData = Array.from(allFoods)
      .map((food) => ({
        food,
        mood: foodStats[food].count > 0 ? +(foodStats[food].totalMood / foodStats[food].count).toFixed(1) : 0,
        count: foodStats[food].count,
      }))
      .sort((a, b) => b.mood - a.mood)

    const productivityData = Array.from(allFoods)
      .map((food) => ({
        food,
        productivity:
          foodStats[food].count > 0 ? +(foodStats[food].totalProductivity / foodStats[food].count).toFixed(1) : 0,
        count: foodStats[food].count,
      }))
      .sort((a, b) => b.productivity - a.productivity)

    // Generate moon phase data
    const moonPhaseData: any[] = []

    Object.keys(foodStats).forEach((food) => {
      Object.keys(foodStats[food].byMoonPhase).forEach((phase) => {
        const phaseStats = foodStats[food].byMoonPhase[phase]
        if (phaseStats.count > 0) {
          moonPhaseData.push({
            food,
            phase,
            mood: +(phaseStats.totalMood / phaseStats.count).toFixed(1),
            productivity: +(phaseStats.totalProductivity / phaseStats.count).toFixed(1),
            count: phaseStats.count,
          })
        }
      })
    })

    // Find lucky foods (high mood AND high productivity)
    const luckyFoodsData = Array.from(allFoods)
      .map((food) => {
        const stats = foodStats[food]
        if (stats.count < 2) return null // Require at least 2 entries for statistical significance

        return {
          food,
          mood: stats.count > 0 ? +(stats.totalMood / stats.count).toFixed(1) : 0,
          productivity: stats.count > 0 ? +(stats.totalProductivity / stats.count).toFixed(1) : 0,
          combined: stats.count > 0 ? +((stats.totalMood + stats.totalProductivity) / (stats.count * 2)).toFixed(1) : 0,
          count: stats.count,
          bestPhase:
            Object.entries(stats.byMoonPhase)
              .filter(([_, phaseStats]) => phaseStats.count > 0)
              .sort(([_, a], [__, b]) => {
                const aAvg = (a.totalMood + a.totalProductivity) / (a.count * 2)
                const bAvg = (b.totalMood + b.totalProductivity) / (b.count * 2)
                return bAvg - aAvg
              })[0]?.[0] || "Unknown",
        }
      })
      .filter((item) => item !== null)
      .sort((a, b) => b!.combined - a!.combined)
      .slice(0, 5) as any[]

    setFoodMoodData(moodData)
    setFoodProductivityData(productivityData)
    setFoodMoonPhaseData(moonPhaseData)
    setLuckyFoods(luckyFoodsData)
  }, [personalEntries, selectedMoonPhase, timeRange])

  // If no entries, show placeholder
  if (!personalEntries || personalEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Food Analysis</CardTitle>
          <CardDescription>No entries available for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Add some daily entries to see food analysis and discover your lucky foods!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-[250px]">
          <Label htmlFor="moon-phase" className="mb-2 block">
            Moon Phase
          </Label>
          <Select value={selectedMoonPhase} onValueChange={setSelectedMoonPhase}>
            <SelectTrigger id="moon-phase">
              <SelectValue placeholder="Select moon phase" />
            </SelectTrigger>
            <SelectContent>
              {moonPhases.map((phase) => (
                <SelectItem key={phase.value} value={phase.value}>
                  {phase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Label htmlFor="time-range" className="mb-2 block">
            Time Range
          </Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lucky Foods Analysis</CardTitle>
          <CardDescription>Foods that correlate with your highest mood and productivity scores</CardDescription>
        </CardHeader>
        <CardContent>
          {luckyFoods.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {luckyFoods.map((food) => (
                  <Card key={food.food} className="overflow-hidden">
                    <CardHeader className="bg-primary/10 py-2">
                      <CardTitle className="text-center text-lg">{food.food}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Mood:</span>
                          <span className="font-medium">{food.mood}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Productivity:</span>
                          <span className="font-medium">{food.productivity}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Combined Score:</span>
                          <span className="font-medium">{food.combined}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Best During:</span>
                          <span className="font-medium">{food.bestPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Times Consumed:</span>
                          <span className="font-medium">{food.count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Insights</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • {luckyFoods[0]?.food} appears to be your luckiest food, with a combined score of{" "}
                    {luckyFoods[0]?.combined}/10
                  </li>
                  <li>• Foods consumed during {luckyFoods[0]?.bestPhase} tend to correlate with your best days</li>
                  <li>
                    • Consider eating{" "}
                    {luckyFoods
                      .slice(0, 3)
                      .map((f) => f.food)
                      .join(", ")}{" "}
                    on important days
                  </li>
                  <li>
                    • Your mood tends to be highest when consuming {foodMoodData[0]?.food} ({foodMoodData[0]?.mood}/10)
                  </li>
                  <li>
                    • Your productivity peaks when eating {foodProductivityData[0]?.food} (
                    {foodProductivityData[0]?.productivity}/10)
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Not enough data to determine lucky foods. Add more entries with food information.
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="mood">
        <TabsList>
          <TabsTrigger value="mood">Food & Mood</TabsTrigger>
          <TabsTrigger value="productivity">Food & Productivity</TabsTrigger>
          <TabsTrigger value="combined">Combined Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Average Mood by Food</CardTitle>
              <CardDescription>How different foods correlate with your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Average Mood",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={foodMoodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="food" type="category" width={100} />
                    <Tooltip
                      formatter={(value, name) => [`${value}/10`, name === "mood" ? "Average Mood" : name]}
                      labelFormatter={(label) => `Food: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="mood" fill="var(--color-mood)" name="Mood" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity">
          <Card>
            <CardHeader>
              <CardTitle>Average Productivity by Food</CardTitle>
              <CardDescription>How different foods correlate with your productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  productivity: {
                    label: "Average Productivity",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={foodProductivityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="food" type="category" width={100} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}/10`,
                        name === "productivity" ? "Average Productivity" : name,
                      ]}
                      labelFormatter={(label) => `Food: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" name="Productivity" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combined">
          <Card>
            <CardHeader>
              <CardTitle>Food Performance by Moon Phase</CardTitle>
              <CardDescription>How your top foods perform during different moon phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This analysis shows how your top foods correlate with mood and productivity during different moon
                  phases. Foods that perform well during specific moon phases may be especially beneficial during those
                  times.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Food</th>
                        <th className="p-2 text-left">Best Moon Phase</th>
                        <th className="p-2 text-left">Mood</th>
                        <th className="p-2 text-left">Productivity</th>
                        <th className="p-2 text-left">Combined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {luckyFoods.map((food) => {
                        // Find the best phase data
                        const bestPhaseData = foodMoonPhaseData.find(
                          (item) => item.food === food.food && item.phase === food.bestPhase,
                        )

                        return (
                          <tr key={food.food} className="border-b">
                            <td className="p-2 font-medium">{food.food}</td>
                            <td className="p-2">{food.bestPhase}</td>
                            <td className="p-2">{bestPhaseData?.mood || food.mood}/10</td>
                            <td className="p-2">{bestPhaseData?.productivity || food.productivity}/10</td>
                            <td className="p-2">
                              {bestPhaseData
                                ? ((bestPhaseData.mood + bestPhaseData.productivity) / 2).toFixed(1)
                                : food.combined}
                              /10
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • During New Moon: Consider eating{" "}
                      {luckyFoods.find((f) => f.bestPhase === "New Moon")?.food || "foods rich in protein"}
                    </li>
                    <li>
                      • During Full Moon: Try{" "}
                      {luckyFoods.find((f) => f.bestPhase === "Full Moon")?.food || "lighter meals with more fruits"}
                    </li>
                    <li>
                      • For important tasks: Eat {foodProductivityData[0]?.food} during{" "}
                      {luckyFoods.find((f) => f.food === foodProductivityData[0]?.food)?.bestPhase || "First Quarter"}{" "}
                      phase
                    </li>
                    <li>
                      • For emotional balance: Include {foodMoodData[0]?.food} in your diet during{" "}
                      {luckyFoods.find((f) => f.food === foodMoodData[0]?.food)?.bestPhase || "Waxing Crescent"} phase
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

