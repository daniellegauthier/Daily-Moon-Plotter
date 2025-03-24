"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AdminCombinedAnalysis } from "./admin-combined-analysis"

// Sample client data
const clientData = [
  {
    id: 1,
    name: "Emma Johnson",
    email: "emma.j@example.com",
    avgMood: 7.8,
    avgProductivity: 8.2,
    favoriteColor: "Blue",
    favoriteFood: "Fruits",
    entriesCount: 28,
    lastActive: "2023-05-01",
  },
  {
    id: 2,
    name: "Michael Smith",
    email: "michael.s@example.com",
    avgMood: 6.5,
    avgProductivity: 7.1,
    favoriteColor: "Black",
    favoriteFood: "Red Meat",
    entriesCount: 15,
    lastActive: "2023-05-03",
  },
  {
    id: 3,
    name: "Sophia Williams",
    email: "sophia.w@example.com",
    avgMood: 8.2,
    avgProductivity: 7.6,
    favoriteColor: "Yellow",
    favoriteFood: "Veggies",
    entriesCount: 22,
    lastActive: "2023-04-29",
  },
  {
    id: 4,
    name: "James Brown",
    email: "james.b@example.com",
    avgMood: 7.1,
    avgProductivity: 6.8,
    favoriteColor: "Green",
    favoriteFood: "Grains",
    entriesCount: 19,
    lastActive: "2023-05-02",
  },
  {
    id: 5,
    name: "Olivia Davis",
    email: "olivia.d@example.com",
    avgMood: 7.5,
    avgProductivity: 8.0,
    favoriteColor: "Purple",
    favoriteFood: "Fish",
    entriesCount: 31,
    lastActive: "2023-05-04",
  },
  {
    id: 6,
    name: "William Miller",
    email: "william.m@example.com",
    avgMood: 6.9,
    avgProductivity: 7.3,
    favoriteColor: "Red",
    favoriteFood: "Eggs",
    entriesCount: 17,
    lastActive: "2023-04-30",
  },
  {
    id: 7,
    name: "Ava Wilson",
    email: "ava.w@example.com",
    avgMood: 8.0,
    avgProductivity: 7.9,
    favoriteColor: "Blue",
    favoriteFood: "Greens",
    entriesCount: 25,
    lastActive: "2023-05-01",
  },
  {
    id: 8,
    name: "Ethan Moore",
    email: "ethan.m@example.com",
    avgMood: 7.3,
    avgProductivity: 7.5,
    favoriteColor: "Grey",
    favoriteFood: "Poultry",
    entriesCount: 20,
    lastActive: "2023-04-28",
  },
]

// Generate client-specific color data
const generateClientColorData = (clientId) => {
  // This would come from the database in a real app
  const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Black", "White", "Grey"]
  return colors.map((color) => ({
    color,
    mood: (Math.random() * 3 + 5).toFixed(1), // Random value between 5-8
    productivity: (Math.random() * 3 + 5).toFixed(1), // Random value between 5-8
  }))
}

// Generate client-specific moon phase data
const generateClientMoonData = (clientId) => {
  // This would come from the database in a real app
  const phases = [
    "New Moon (1-3)",
    "Waxing Crescent (4-7)",
    "First Quarter (8-11)",
    "Waxing Gibbous (12-15)",
    "Full Moon (16-18)",
    "Waning Gibbous (19-22)",
    "Last Quarter (23-26)",
    "Waning Crescent (27-30)",
  ]

  return phases.map((phase) => ({
    phase,
    mood: (Math.random() * 3 + 5).toFixed(1), // Random value between 5-8
    productivity: (Math.random() * 3 + 5).toFixed(1), // Random value between 5-8
  }))
}

// Generate client-specific food data
const generateClientFoodData = (clientId) => {
  // This would come from the database in a real app
  const foods = ["Greens", "Red Meat", "Poultry", "Eggs", "Grains", "Beans", "Fruits", "Sweets", "Fish", "Veggies"]

  // Make the data slightly different for each client
  const clientIndex = Number.parseInt(clientId) - 1
  const offset = clientIndex * 0.5

  return foods.map((food) => ({
    food,
    mood: ((Math.random() * 2.5 + 5.5 + (food === clientData[clientIndex]?.favoriteFood ? 1.5 : 0)) % 10).toFixed(1),
    productivity: ((Math.random() * 2.5 + 5.5 + (food === clientData[clientIndex]?.favoriteFood ? 1 : 0)) % 10).toFixed(
      1,
    ),
  }))
}

// Generate client-specific lucky foods data
const generateClientLuckyFoods = (clientId) => {
  const clientIndex = Number.parseInt(clientId) - 1
  const client = clientData[clientIndex]

  // Generate 3 lucky foods for each client
  const luckyFoods = [
    {
      food: client?.favoriteFood || "Fruits",
      mood: (Math.random() * 1 + 8).toFixed(1),
      productivity: (Math.random() * 1 + 8).toFixed(1),
      combined: (Math.random() * 0.5 + 8.5).toFixed(1),
      bestPhase: ["New Moon", "Full Moon", "Waxing Crescent", "Waning Gibbous"][Math.floor(Math.random() * 4)],
    },
    {
      food: ["Greens", "Veggies", "Fruits", "Fish"][Math.floor(Math.random() * 4)],
      mood: (Math.random() * 1 + 7.5).toFixed(1),
      productivity: (Math.random() * 1 + 7.5).toFixed(1),
      combined: (Math.random() * 0.5 + 8).toFixed(1),
      bestPhase: ["First Quarter", "Last Quarter", "Waxing Gibbous", "Waning Crescent"][Math.floor(Math.random() * 4)],
    },
    {
      food: ["Grains", "Beans", "Eggs", "Poultry"][Math.floor(Math.random() * 4)],
      mood: (Math.random() * 1 + 7).toFixed(1),
      productivity: (Math.random() * 1 + 7).toFixed(1),
      combined: (Math.random() * 0.5 + 7.5).toFixed(1),
      bestPhase: ["New Moon", "Full Moon", "First Quarter", "Last Quarter"][Math.floor(Math.random() * 4)],
    },
  ]

  // Make sure we don't have duplicate foods
  if (luckyFoods[1].food === luckyFoods[0].food) {
    luckyFoods[1].food = "Grains"
  }
  if (luckyFoods[2].food === luckyFoods[0].food || luckyFoods[2].food === luckyFoods[1].food) {
    luckyFoods[2].food = "Beans"
  }

  return luckyFoods
}

export function AdminTrendAnalysis() {
  const [timeRange, setTimeRange] = useState("all")
  const [selectedClient, setSelectedClient] = useState(clientData[0].id.toString())

  // Get the selected client's data
  const client = clientData.find((c) => c.id.toString() === selectedClient)

  // Generate data for the selected client
  const clientColorData = generateClientColorData(selectedClient)
  const clientMoonData = generateClientMoonData(selectedClient)
  const clientFoodData = generateClientFoodData(selectedClient)
  const clientLuckyFoods = generateClientLuckyFoods(selectedClient)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-[250px]">
          <Label htmlFor="client-select" className="mb-2 block">
            Select Client
          </Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger id="client-select">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clientData.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
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
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {client && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Client Overview: {client.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="font-medium">{client.avgMood.toFixed(1)}/10</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Productivity</p>
                <p className="font-medium">{client.avgProductivity.toFixed(1)}/10</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="font-medium">{client.entriesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">Color Analysis</TabsTrigger>
          <TabsTrigger value="foods">Food Analysis</TabsTrigger>
          <TabsTrigger value="moon">Moon Phase Analysis</TabsTrigger>
          <TabsTrigger value="combined">Combined Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Productivity by Color for {client?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Average Mood",
                    color: "hsl(var(--chart-1))",
                  },
                  productivity: {
                    label: "Average Productivity",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientColorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="color" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="mood" fill="var(--color-mood)" name="Mood" />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" name="Productivity" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Color Analysis Insights</h3>
                <p>
                  Based on {client?.name}'s data, we can see that when they wear {client?.favoriteColor}, their mood and
                  productivity tend to be higher than average.
                </p>
                <p>
                  Recommendation: Encourage wearing {clientColorData.sort((a, b) => b.mood - a.mood)[0].color} for
                  improved mood and {clientColorData.sort((a, b) => b.productivity - a.productivity)[0].color} for
                  better productivity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foods">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Productivity by Food for {client?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Average Mood",
                    color: "hsl(var(--chart-1))",
                  },
                  productivity: {
                    label: "Average Productivity",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientFoodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="food" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="mood" fill="var(--color-mood)" name="Mood" />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" name="Productivity" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Lucky Foods for {client?.name}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {clientLuckyFoods.map((food, index) => (
                    <Card key={index} className="overflow-hidden">
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Food Analysis Insights</h3>
                <p>
                  {client?.name}'s data shows that {clientLuckyFoods[0].food} consumption correlates with their highest
                  combined mood and productivity scores.
                </p>
                <p>
                  Their mood is most elevated when consuming {clientFoodData.sort((a, b) => b.mood - a.mood)[0].food},
                  while productivity peaks with {clientFoodData.sort((a, b) => b.productivity - a.productivity)[0].food}
                  .
                </p>
                <p>
                  Recommendation: Encourage {clientLuckyFoods[0].food} consumption during{" "}
                  {clientLuckyFoods[0].bestPhase} phases, and {clientLuckyFoods[1].food} during{" "}
                  {clientLuckyFoods[1].bestPhase} phases for optimal results.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moon">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Productivity by Moon Phase for {client?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Average Mood",
                    color: "hsl(var(--chart-1))",
                  },
                  productivity: {
                    label: "Average Productivity",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientMoonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="mood" fill="var(--color-mood)" name="Mood" />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" name="Productivity" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Moon Phase Analysis Insights</h3>
                <p>
                  For {client?.name}, the {clientMoonData.sort((a, b) => b.mood - a.mood)[0].phase} phase shows the
                  highest mood ratings.
                </p>
                <p>
                  Productivity peaks during the{" "}
                  {clientMoonData.sort((a, b) => b.productivity - a.productivity)[0].phase} phase.
                </p>
                <p>
                  Recommendation: Schedule important tasks and meetings during these optimal lunar phases for best
                  results.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combined">
          <AdminCombinedAnalysis clientId={selectedClient} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

