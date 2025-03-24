"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data with updated food categories
const sampleEntries = [
  {
    id: 1,
    date: "2023-05-01",
    moonDay: 12,
    colors: ["Blue", "Black"],
    mood: 7,
    productivity: 8,
    foods: "Greens, Red Meat, Grains",
  },
  {
    id: 2,
    date: "2023-05-02",
    moonDay: 13,
    colors: ["Red", "White"],
    mood: 6,
    productivity: 7,
    foods: "Poultry, Grains, Veggies",
  },
  {
    id: 3,
    date: "2023-05-03",
    moonDay: 14,
    colors: ["Green", "Yellow"],
    mood: 8,
    productivity: 9,
    foods: "Fish, Veggies, Fruits",
  },
  {
    id: 4,
    date: "2023-05-04",
    moonDay: 15,
    colors: ["Purple", "Black"],
    mood: 5,
    productivity: 6,
    foods: "Poultry, Greens, Sweets",
  },
  {
    id: 5,
    date: "2023-05-05",
    moonDay: 16,
    colors: ["Blue", "Grey"],
    mood: 7,
    productivity: 8,
    foods: "Eggs, Fruits, Grains",
  },
]

export default function HistoryPage() {
  const [entries, setEntries] = useState(sampleEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterColor, setFilterColor] = useState("")
  const [filterFood, setFilterFood] = useState("")

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.foods.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesColor = filterColor ? entry.colors.includes(filterColor) : true
    const matchesFood = filterFood ? entry.foods.includes(filterFood) : true
    return matchesSearch && matchesColor && matchesFood
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <Button>Export CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search Foods</Label>
              <Input
                id="search"
                placeholder="Search by food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-filter">Filter by Color</Label>
              <Select value={filterColor} onValueChange={setFilterColor}>
                <SelectTrigger id="color-filter">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Yellow">Yellow</SelectItem>
                  <SelectItem value="Purple">Purple</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Grey">Grey</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="food-filter">Filter by Food</Label>
              <Select value={filterFood} onValueChange={setFilterFood}>
                <SelectTrigger id="food-filter">
                  <SelectValue placeholder="Select food category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Foods</SelectItem>
                  <SelectItem value="Greens">Greens</SelectItem>
                  <SelectItem value="Red Meat">Red Meat</SelectItem>
                  <SelectItem value="Poultry">Poultry</SelectItem>
                  <SelectItem value="Eggs">Eggs</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Beans">Beans</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Sweets">Sweets</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Veggies">Veggies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Moon Day</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Foods</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.moonDay}</TableCell>
                  <TableCell>{entry.colors.join(", ")}</TableCell>
                  <TableCell>{entry.mood}/10</TableCell>
                  <TableCell>{entry.productivity}/10</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {entry.foods.split(", ").map((food) => (
                        <span
                          key={food}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

