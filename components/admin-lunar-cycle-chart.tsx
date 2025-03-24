"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"

// Define the type for our moon data
interface MoonData {
  day: number
  goddess: string
  productivity: number
  mood?: number
  date: string
  fullDate: Date
  moonPhase?: string
  isUserEntry?: boolean
  moonDay?: number
}

interface TimeFrame {
  id: string
  name: string
  startDate?: Date
  endDate?: Date
}

interface PersonalEntry {
  id: number
  date: string
  moonDay: number
  colors: string[]
  mood: number
  productivity: number
  foods: string
}

interface AdminLunarCycleChartProps {
  personalEntries: PersonalEntry[]
}

export function AdminLunarCycleChart({ personalEntries }: AdminLunarCycleChartProps) {
  const [csvMoonData, setCsvMoonData] = useState<MoonData[]>([])
  const [allMoonData, setAllMoonData] = useState<MoonData[]>([])
  const [filteredMoonData, setFilteredMoonData] = useState<MoonData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("full-cycle")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 2, 10)) // March 10, 2024
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2024, 3, 8)) // April 8, 2024
  const [showPersonalEntries, setShowPersonalEntries] = useState(true)
  const [showCSVData, setShowCSVData] = useState(true)

  // Define time frame options
  const timeFrames: TimeFrame[] = [
    { id: "full-cycle", name: "Full Lunar Cycle (Mar 10 - Apr 8)" },
    {
      id: "first-half",
      name: "First Half (New Moon to Full Moon)",
      startDate: new Date(2024, 2, 10),
      endDate: new Date(2024, 2, 25),
    },
    {
      id: "second-half",
      name: "Second Half (Full Moon to New Moon)",
      startDate: new Date(2024, 2, 25),
      endDate: new Date(2024, 3, 8),
    },
    { id: "custom", name: "Custom Date Range" },
  ]

  // Load CSV data
  useEffect(() => {
    async function fetchMoonData() {
      try {
        const response = await fetch("/data/moon-2024.csv")
        const csvText = await response.text()

        // Parse CSV data
        const rows = csvText.split("\n")
        const headers = rows[0].split(",")

        // Find the row with productivity data
        const productivityRow = rows.find((row) => row.includes("productivity"))

        if (!productivityRow) {
          setError("Productivity data not found in CSV")
          setIsLoading(false)
          return
        }

        const productivityValues = productivityRow.split(",")

        // Map goddess names to their productivity values
        const goddessData: MoonData[] = []

        // Define the start date (March 10, 2024)
        const startDate = new Date(2024, 2, 10) // Month is 0-indexed (2 = March)

        // Define full and new moon dates for this period
        // March 2024: New Moon on March 10, Full Moon on March 25
        // April 2024: New Moon on April 8
        const moonPhases = {
          "2024-03-10": "New Moon",
          "2024-03-25": "Full Moon",
          "2024-04-08": "New Moon",
        }

        // Start from index 1 to skip the first column which is the label
        for (let i = 1; i < headers.length; i++) {
          if (headers[i] && productivityValues[i]) {
            const goddessName = headers[i].trim()
            // Skip empty columns
            if (goddessName === "") continue

            const productivityValue = Number.parseInt(productivityValues[i].trim())

            // Calculate the date for this day
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + (i - 1))

            const dateString = currentDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
            const displayDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}` // Format as M/D

            // Check if this date is a special moon phase
            const moonPhase = moonPhases[dateString]

            // Only add valid data points
            if (!isNaN(productivityValue)) {
              goddessData.push({
                day: i,
                goddess: goddessName,
                productivity: productivityValue,
                date: displayDate,
                fullDate: new Date(currentDate),
                moonPhase,
                isUserEntry: false,
                moonDay: i, // Set moon day to match the day in the lunar cycle
              })
            }
          }
        }

        setCsvMoonData(goddessData)
        setAllMoonData(goddessData) // Initially show all data
        setFilteredMoonData(goddessData)
      } catch (err) {
        setError("Error loading moon data")
        console.error("Error loading moon data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoonData()
  }, [])

  // Merge personal entries with moon data
  useEffect(() => {
    if (csvMoonData.length === 0) return

    // Start with a clean slate - either CSV data or an empty array
    const mergedData: MoonData[] = showCSVData ? [...csvMoonData] : []

    // If we're showing personal entries, add them to the merged data
    if (showPersonalEntries && personalEntries.length > 0) {
      // Process each personal entry
      personalEntries.forEach((entry) => {
        const entryDate = new Date(entry.date)
        const formattedDate = `${entryDate.getMonth() + 1}/${entryDate.getDate()}`

        // Check if this date already exists in the CSV data
        const existingCsvIndex = csvMoonData.findIndex(
          (data) => data.fullDate.toDateString() === entryDate.toDateString(),
        )

        // Check if this date already exists in the merged data
        const existingMergedIndex = mergedData.findIndex(
          (data) => data.fullDate.toDateString() === entryDate.toDateString(),
        )

        if (existingMergedIndex >= 0) {
          // If we're showing both CSV and personal entries, prioritize personal entries
          // by updating the existing entry with the personal data
          mergedData[existingMergedIndex] = {
            ...mergedData[existingMergedIndex],
            productivity: entry.productivity,
            mood: entry.mood,
            isUserEntry: true,
            moonDay: entry.moonDay,
          }
        } else {
          // If the date doesn't exist in our merged data, add the personal entry
          // Get goddess name from CSV data if available
          const goddessName = existingCsvIndex >= 0 ? csvMoonData[existingCsvIndex].goddess : `Day ${entry.moonDay}`

          // Get moon phase from CSV data if available
          const moonPhase = existingCsvIndex >= 0 ? csvMoonData[existingCsvIndex].moonPhase : undefined

          // Add the new entry
          mergedData.push({
            day: entry.moonDay,
            goddess: goddessName,
            productivity: entry.productivity,
            mood: entry.mood,
            date: formattedDate,
            fullDate: entryDate,
            moonPhase,
            isUserEntry: true,
            moonDay: entry.moonDay,
          })
        }
      })
    }

    // Sort the merged data by date
    mergedData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())

    // Update the all moon data with merged data
    setAllMoonData(mergedData)
  }, [personalEntries, showPersonalEntries, showCSVData, csvMoonData])

  // Filter data based on selected time frame
  useEffect(() => {
    if (allMoonData.length === 0) return

    let filtered
    const selectedFrame = timeFrames.find((tf) => tf.id === selectedTimeFrame)

    if (selectedTimeFrame === "custom") {
      // Custom date range
      if (startDate && endDate) {
        filtered = allMoonData.filter((data) => {
          // Create date objects with time set to noon to avoid timezone issues
          const dataDate = new Date(data.fullDate)
          dataDate.setHours(12, 0, 0, 0)

          const start = new Date(startDate)
          start.setHours(12, 0, 0, 0)

          const end = new Date(endDate)
          end.setHours(12, 0, 0, 0)

          return dataDate >= start && dataDate <= end
        })
      } else {
        filtered = allMoonData
      }
    } else if (selectedFrame && selectedFrame.startDate && selectedFrame.endDate) {
      // Predefined date range
      filtered = allMoonData.filter((data) => {
        // Create date objects with time set to noon to avoid timezone issues
        const dataDate = new Date(data.fullDate)
        dataDate.setHours(12, 0, 0, 0)

        const start = new Date(selectedFrame.startDate!)
        start.setHours(12, 0, 0, 0)

        const end = new Date(selectedFrame.endDate!)
        end.setHours(12, 0, 0, 0)

        return dataDate >= start && dataDate <= end
      })
    } else {
      // Default: show all data
      filtered = allMoonData
    }

    setFilteredMoonData(filtered)
  }, [selectedTimeFrame, startDate, endDate, allMoonData])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[400px]">Loading lunar cycle data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[400px] text-red-500">{error}</div>
  }

  // Find indices of full and new moons for reference lines
  const fullMoonIndex = filteredMoonData.findIndex((data) => data.moonPhase === "Full Moon")
  const newMoonIndices = filteredMoonData
    .map((data, index) => (data.moonPhase === "New Moon" ? index : -1))
    .filter((index) => index !== -1)

  // Calculate a reasonable date range for the date picker
  // Allow selecting dates from 1 year ago to 1 year in the future
  const minSelectableDate = new Date()
  minSelectableDate.setFullYear(minSelectableDate.getFullYear() - 1)

  const maxSelectableDate = new Date()
  maxSelectableDate.setFullYear(maxSelectableDate.getFullYear() + 1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-[250px]">
          <Label htmlFor="time-frame" className="mb-2 block">
            Time Frame
          </Label>
          <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
            <SelectTrigger id="time-frame">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              {timeFrames.map((frame) => (
                <SelectItem key={frame.id} value={frame.id}>
                  {frame.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTimeFrame === "custom" && (
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <Label htmlFor="start-date" className="mb-2 block">
                Start Date
              </Label>
              <DatePicker
                id="start-date"
                date={startDate}
                onSelect={setStartDate}
                fromDate={minSelectableDate}
                toDate={maxSelectableDate}
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="mb-2 block">
                End Date
              </Label>
              <DatePicker
                id="end-date"
                date={endDate}
                onSelect={setEndDate}
                fromDate={minSelectableDate}
                toDate={maxSelectableDate}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center space-x-2">
            <Switch id="show-csv" checked={showCSVData} onCheckedChange={setShowCSVData} />
            <Label htmlFor="show-csv">CSV Data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-personal" checked={showPersonalEntries} onCheckedChange={setShowPersonalEntries} />
            <Label htmlFor="show-personal">My Entries</Label>
          </div>
        </div>
      </div>

      <ChartContainer
        config={{
          productivity: {
            label: "Productivity",
            color: "hsl(var(--chart-1))",
          },
          mood: {
            label: "Mood",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredMoonData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              label={{ value: "Date (Month/Day) & Moon Phases", position: "insideBottomRight", offset: -15 }}
              tick={(props) => {
                const { x, y, payload } = props
                const index = filteredMoonData.findIndex((d) => d.date === payload.value)
                const data = filteredMoonData[index]

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                      {payload.value}
                    </text>
                    {data?.moonPhase && (
                      <text
                        x={0}
                        y={0}
                        dy={32}
                        textAnchor="middle"
                        fill={data.moonPhase === "Full Moon" ? "#6366f1" : "#000"}
                        fontSize={10}
                        fontWeight="bold"
                      >
                        {data.moonPhase === "Full Moon" ? "🌕" : "🌑"}
                      </text>
                    )}
                  </g>
                )
              }}
              height={60}
            />
            <YAxis label={{ value: "Rating (1-10)", angle: -90, position: "insideLeft" }} domain={[0, 10]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  customContent={(data) => (
                    <div>
                      <p className="font-medium">
                        {data.date} - Moon Day {data.moonDay || data.day}
                      </p>
                      {data.goddess && <p>Goddess: {data.goddess}</p>}
                      <p>Productivity: {data.productivity}/10</p>
                      {data.mood && <p>Mood: {data.mood}/10</p>}
                      {data.moonPhase && <p className="font-bold">{data.moonPhase}</p>}
                      {data.isUserEntry && <p className="text-primary font-bold">Your Entry</p>}
                    </div>
                  )}
                />
              }
            />
            <Legend />

            {/* Add reference lines for full moon */}
            {fullMoonIndex !== -1 && (
              <ReferenceLine
                x={filteredMoonData[fullMoonIndex].date}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={{ value: "Full Moon", position: "top", fill: "#6366f1" }}
              />
            )}

            {/* Add reference lines for new moons */}
            {newMoonIndices.map((index) => (
              <ReferenceLine
                key={`new-moon-${index}`}
                x={filteredMoonData[index].date}
                stroke="#000"
                strokeDasharray="3 3"
                label={{ value: "New Moon", position: "top", fill: "#000" }}
              />
            ))}

            <Line
              type="monotone"
              dataKey="productivity"
              stroke="var(--color-productivity)"
              activeDot={{ r: 8 }}
              name="Productivity"
              strokeWidth={2}
            />

            {/* Add mood line if we have mood data */}
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--color-mood)"
              activeDot={{ r: 6 }}
              name="Mood"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

