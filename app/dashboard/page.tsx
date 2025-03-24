"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DailyEntryForm } from "@/components/daily-entry-form"
import { LunarCycleChart } from "@/components/lunar-cycle-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [showEntryForm, setShowEntryForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setShowEntryForm(!showEntryForm)}>
          {showEntryForm ? "Close Form" : "Add Today's Entry"}
        </Button>
      </div>

      {showEntryForm && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Entry</CardTitle>
            <CardDescription>Record your activities for today</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyEntryForm onComplete={() => setShowEntryForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Lunar Cycle Chart</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Lunar Cycle Data</CardTitle>
              <CardDescription>Visualizing your mood and productivity over the lunar cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <LunarCycleChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2</div>
                <p className="text-xs text-muted-foreground">+4% from last cycle</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.8</div>
                <p className="text-xs text-muted-foreground">-2% from last cycle</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Worn Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Blue</div>
                <p className="text-xs text-muted-foreground">5 days this cycle</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

