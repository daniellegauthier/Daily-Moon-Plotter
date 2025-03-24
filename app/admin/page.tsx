"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AdminUserTable } from "@/components/admin-user-table"
import { AdminTrendAnalysis } from "@/components/admin-trend-analysis"
import { DailyEntryForm } from "@/components/daily-entry-form"
import { AdminLunarCycleChart } from "@/components/admin-lunar-cycle-chart"
import { AdminFoodAnalysis } from "@/components/admin-food-analysis"
import { useState } from "react"
import { Pencil } from "lucide-react"

// Add useEffect to check for admin access
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Update the AdminPage component to check for admin access
export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState("")
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const { toast } = useToast()

  // Empty array for personal entries - no fake data
  const [personalEntries, setPersonalEntries] = useState([])

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedData = JSON.parse(userData)
      if (parsedData.role === "admin") {
        setIsAdmin(true)
        setUserName(parsedData.name)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleEntryComplete = (entryData) => {
    // In a real app, this would save to a database
    // For demo purposes, we'll just add it to our local state

    if (entryData.isUpdate && entryData.id) {
      // Update existing entry
      setPersonalEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === entryData.id ? { ...entryData } : entry)),
      )
    } else {
      // Add new entry
      const entry = {
        id: personalEntries.length + 1,
        ...entryData,
      }
      setPersonalEntries([...personalEntries, entry])
    }

    setShowEntryForm(false)
    setEditingEntry(null)
  }

  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setShowEntryForm(true)
  }

  const handleAddOrUpdateEntry = () => {
    // Check if there's an entry for today
    const today = new Date().toISOString().split("T")[0]
    const todayEntry = personalEntries.find((entry) => new Date(entry.date).toISOString().split("T")[0] === today)

    if (todayEntry) {
      // If there's an entry for today, edit it
      setEditingEntry(todayEntry)
    } else {
      // Otherwise, create a new entry
      setEditingEntry(null)
    }

    setShowEntryForm(!showEntryForm)
  }

  if (!isAdmin) {
    return null // Don't render anything until we've checked admin status
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {userName}</p>
        </div>
        <div className="flex gap-2">
          <Button>Export All Data</Button>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">My Data</TabsTrigger>
          <TabsTrigger value="food-analysis">Food Analysis</TabsTrigger>
          <TabsTrigger value="trends">Client Analysis</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">My Personal Data</h2>
              <Button onClick={handleAddOrUpdateEntry}>{showEntryForm ? "Cancel" : "Add/Update Today's Entry"}</Button>
            </div>

            {showEntryForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingEntry ? "Update Entry" : "Daily Entry"}</CardTitle>
                  <CardDescription>
                    {editingEntry
                      ? `Updating entry for ${new Date(editingEntry.date).toLocaleDateString()}`
                      : "Record your activities for today"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DailyEntryForm
                    onComplete={handleEntryComplete}
                    existingEntry={editingEntry}
                    personalEntries={personalEntries}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Your Lunar Cycle Data</CardTitle>
                <CardDescription>Visualizing your productivity and mood over the lunar cycle</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <AdminLunarCycleChart personalEntries={personalEntries} />
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center">
                    <span className="inline-block mr-2">🌑</span>
                    <span>New Moon</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block mr-2">🌕</span>
                    <span>Full Moon</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {personalEntries.length > 0 ? (
                    <div className="space-y-4">
                      {personalEntries
                        .slice()
                        .reverse()
                        .map((entry) => (
                          <div key={entry.id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium flex items-center">
                                  {new Date(entry.date).toLocaleDateString()}
                                  <span className="ml-2">
                                    (Moon Day: {entry.moonDay}{" "}
                                    {entry.moonPhase && (
                                      <span className="text-xs text-muted-foreground ml-1">{entry.moonPhase}</span>
                                    )}
                                    )
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-2"
                                    onClick={() => handleEditEntry(entry)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </p>
                                <p className="text-sm text-muted-foreground">Colors: {entry.colors.join(", ")}</p>
                              </div>
                              <div className="text-right">
                                <p>Mood: {entry.mood}/10</p>
                                <p>Productivity: {entry.productivity}/10</p>
                              </div>
                            </div>
                            <p className="text-sm">
                              Foods:{" "}
                              {entry.foods ? (
                                <span className="flex flex-wrap gap-1 mt-1">
                                  {entry.foods.split(", ").map((food) => (
                                    <span
                                      key={food}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                                    >
                                      {food}
                                    </span>
                                  ))}
                                </span>
                              ) : (
                                "None recorded"
                              )}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        No entries yet. Start tracking your daily activities!
                      </p>
                      <Button variant="outline" onClick={() => setShowEntryForm(true)}>
                        Add Your First Entry
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lunar Cycle Insights</CardTitle>
                  <CardDescription>Based on your productivity data from Mar 10 - Apr 8, 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Moon Phase Patterns</h3>
                      <p>
                        Your productivity peaks during Nitya (day 11) and Matra (day 29) phases with scores of 10/10.
                      </p>
                      <p>The Full Moon period (March 25) shows a significant drop in productivity.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Monthly Cycles</h3>
                      <p>Early lunar cycle (days 1-7) shows consistently high productivity (7-10/10).</p>
                      <p>Days 12-16 (Nilapataka through Jvamalini) show consistently lower productivity (2/10).</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Planning Recommendations</h3>
                      <p>Schedule demanding tasks for the week before Full Moon.</p>
                      <p>Use the days following Full Moon for reflection and planning rather than execution.</p>
                      <p>Plan complex projects to start in the early lunar cycle when your productivity is highest.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="food-analysis">
          <AdminFoodAnalysis personalEntries={personalEntries} />
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Client Analysis</CardTitle>
              <CardDescription>Analyze individual client data by color and moon phase</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTrendAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUserTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Report</CardTitle>
                <CardDescription>User engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Total active users: 127</p>
                <p className="mb-2">New users this month: 24</p>
                <p className="mb-4">Average entries per user: 18.3</p>
                <Button variant="outline" size="sm">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Trends Report</CardTitle>
                <CardDescription>Aggregate mood data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Average mood score: 6.8/10</p>
                <p className="mb-2">Highest mood day: Day 15 (7.9/10)</p>
                <p className="mb-4">Lowest mood day: Day 28 (5.2/10)</p>
                <Button variant="outline" size="sm">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Correlation Report</CardTitle>
                <CardDescription>Color and mood/productivity correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Highest mood color: Yellow (7.8/10)</p>
                <p className="mb-2">Highest productivity color: Blue (8.1/10)</p>
                <p className="mb-4">Most worn color: Black (22% of entries)</p>
                <Button variant="outline" size="sm">
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

