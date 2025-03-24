"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CombinedAnalysisProps {
  clientId: string
}

export function AdminCombinedAnalysis({ clientId }: CombinedAnalysisProps) {
  const [selectedMoonPhase, setSelectedMoonPhase] = useState("all")

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

  // Generate sample data for combined analysis
  // In a real app, this would come from the database
  const generateCombinedData = () => {
    const combinations = []
    const colors = ["Blue", "Red", "Green", "Black", "Yellow"]
    const foods = ["Fruits", "Veggies", "Grains", "Fish", "Poultry"]
    const phases = ["New Moon", "Full Moon", "First Quarter", "Waning Gibbous"]

    // Generate some combinations
    for (let i = 0; i < 10; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const food = foods[Math.floor(Math.random() * foods.length)]
      const phase = phases[Math.floor(Math.random() * phases.length)]

      combinations.push({
        id: i + 1,
        color,
        food,
        phase,
        mood: (Math.random() * 3 + 6).toFixed(1),
        productivity: (Math.random() * 3 + 6).toFixed(1),
        combined: (Math.random() * 3 + 6).toFixed(1),
        count: Math.floor(Math.random() * 5) + 1,
      })
    }

    // Add some "lucky" combinations with higher scores
    combinations.push({
      id: 11,
      color: "Blue",
      food: "Fruits",
      phase: "New Moon",
      mood: "9.2",
      productivity: "9.5",
      combined: "9.4",
      count: 3,
    })

    combinations.push({
      id: 12,
      color: "Green",
      food: "Veggies",
      phase: "Full Moon",
      mood: "9.0",
      productivity: "9.3",
      combined: "9.2",
      count: 4,
    })

    return combinations
  }

  const combinedData = generateCombinedData()

  // Filter by moon phase if selected
  const filteredData =
    selectedMoonPhase === "all"
      ? combinedData
      : combinedData.filter((item) => {
          const phase = item.phase
          if (selectedMoonPhase === "new" && phase === "New Moon") return true
          if (selectedMoonPhase === "full" && phase === "Full Moon") return true
          if (selectedMoonPhase === "first-quarter" && phase === "First Quarter") return true
          if (selectedMoonPhase === "waning-gibbous" && phase === "Waning Gibbous") return true
          return false
        })

  // Sort by combined score
  const sortedData = [...filteredData].sort((a, b) => Number.parseFloat(b.combined) - Number.parseFloat(a.combined))

  // Get top combinations
  const topCombinations = sortedData.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Analysis</CardTitle>
        <CardDescription>Discover optimal combinations of colors, foods, and moon phases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="w-[250px]">
            <Label htmlFor="moon-phase-filter" className="mb-2 block">
              Filter by Moon Phase
            </Label>
            <Select value={selectedMoonPhase} onValueChange={setSelectedMoonPhase}>
              <SelectTrigger id="moon-phase-filter">
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

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Top Combinations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Color</TableHead>
                  <TableHead>Food</TableHead>
                  <TableHead>Moon Phase</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Productivity</TableHead>
                  <TableHead>Combined</TableHead>
                  <TableHead>Occurrences</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCombinations.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              combo.color.toLowerCase() === "blue"
                                ? "blue"
                                : combo.color.toLowerCase() === "red"
                                  ? "red"
                                  : combo.color.toLowerCase() === "green"
                                    ? "green"
                                    : combo.color.toLowerCase() === "black"
                                      ? "black"
                                      : combo.color.toLowerCase() === "yellow"
                                        ? "gold"
                                        : "gray",
                          }}
                        />
                        {combo.color}
                      </div>
                    </TableCell>
                    <TableCell>{combo.food}</TableCell>
                    <TableCell>{combo.phase}</TableCell>
                    <TableCell>{combo.mood}/10</TableCell>
                    <TableCell>{combo.productivity}/10</TableCell>
                    <TableCell className="font-medium">{combo.combined}/10</TableCell>
                    <TableCell>{combo.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Insights & Recommendations</h3>
            <ul className="space-y-1 text-sm">
              <li>
                • The combination of <span className="font-medium">{topCombinations[0]?.color}</span> +{" "}
                <span className="font-medium">{topCombinations[0]?.food}</span> during{" "}
                <span className="font-medium">{topCombinations[0]?.phase}</span> shows the highest combined score of{" "}
                {topCombinations[0]?.combined}/10
              </li>
              <li>
                • For important presentations or meetings, consider wearing{" "}
                <span className="font-medium">{topCombinations[0]?.color}</span> and eating{" "}
                <span className="font-medium">{topCombinations[0]?.food}</span>
              </li>
              <li>
                • Schedule critical tasks during <span className="font-medium">{topCombinations[0]?.phase}</span> phases
                when possible
              </li>
              <li>
                • The client shows consistently higher mood when wearing{" "}
                <span className="font-medium">
                  {
                    topCombinations.find(
                      (c) =>
                        Number.parseFloat(c.mood) ===
                        Math.max(...topCombinations.map((c) => Number.parseFloat(c.mood))),
                    )?.color
                  }
                </span>
              </li>
              <li>
                • Productivity peaks when consuming{" "}
                <span className="font-medium">
                  {
                    topCombinations.find(
                      (c) =>
                        Number.parseFloat(c.productivity) ===
                        Math.max(...topCombinations.map((c) => Number.parseFloat(c.productivity))),
                    )?.food
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

