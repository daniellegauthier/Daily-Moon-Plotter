"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { getMoonDay, getMoonPhaseName, getMoonEmoji } from "@/lib/utils"

interface DailyEntryFormProps {
  onComplete: (entryData: any) => void
  existingEntry?: any
  personalEntries?: any[]
}

const colorOptions = [
  "Grey",
  "Pink",
  "Gold",
  "Nude",
  "Orange",
  "White",
  "Blue",
  "Green",
  "Red",
  "Black",
  "Brown",
  "Yellow",
  "Purple",
]

export function DailyEntryForm({ onComplete, existingEntry, personalEntries = [] }: DailyEntryFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(today)
  const [moonDay, setMoonDay] = useState(1)
  const [moonPhase, setMoonPhase] = useState("")
  const [moonEmoji, setMoonEmoji] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [mood, setMood] = useState(5)
  const [productivity, setProductivity] = useState(5)
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [entryId, setEntryId] = useState<number | null>(null)
  const { toast } = useToast()

  const foodCategories = [
    "Greens",
    "Red Meat", // Changed from "Meat" to "Red Meat"
    "Poultry", // Added new category for poultry
    "Eggs",
    "Grains",
    "Beans",
    "Fruits",
    "Sweets",
    "Fish",
    "Veggies",
  ]

  // Check for existing entry for the selected date
  useEffect(() => {
    const checkExistingEntry = () => {
      const existingEntryForDate = personalEntries.find(
        (entry) => new Date(entry.date).toISOString().split("T")[0] === date,
      )

      if (existingEntryForDate) {
        // Found an existing entry for this date
        setEntryId(existingEntryForDate.id)
        setMoonDay(existingEntryForDate.moonDay)
        setMoonPhase(existingEntryForDate.moonPhase || "")
        setSelectedColors(existingEntryForDate.colors || [])
        setMood(existingEntryForDate.mood)
        setProductivity(existingEntryForDate.productivity)

        // Handle food categories
        if (existingEntryForDate.foods) {
          const foodsArray = existingEntryForDate.foods.split(", ")

          // Convert "Meat" to "Red Meat" for backward compatibility
          const updatedFoodsArray = foodsArray.map((food) => (food === "Meat" ? "Red Meat" : food))

          setSelectedFoods(updatedFoodsArray)
        } else {
          setSelectedFoods([])
        }

        setIsEditing(true)

        toast({
          title: "Entry found",
          description: "Editing existing entry for this date",
        })
      } else {
        // No existing entry, reset form
        resetForm(date)
        setIsEditing(false)
      }
    }

    // If we have an existingEntry prop, use that instead
    if (existingEntry) {
      setEntryId(existingEntry.id)
      setDate(existingEntry.date)
      setMoonDay(existingEntry.moonDay)
      setMoonPhase(existingEntry.moonPhase || "")
      setSelectedColors(existingEntry.colors || [])
      setMood(existingEntry.mood)
      setProductivity(existingEntry.productivity)

      // Handle food categories
      if (existingEntry.foods) {
        const foodsArray = existingEntry.foods.split(", ")

        // Convert "Meat" to "Red Meat" for backward compatibility
        const updatedFoodsArray = foodsArray.map((food) => (food === "Meat" ? "Red Meat" : food))

        setSelectedFoods(updatedFoodsArray)
      } else {
        setSelectedFoods([])
      }

      setIsEditing(true)
    } else {
      checkExistingEntry()
    }
  }, [date, existingEntry, personalEntries, toast])

  // Update moon day when date changes
  useEffect(() => {
    const selectedDate = new Date(date)
    const calculatedMoonDay = getMoonDay(selectedDate)
    const phaseName = getMoonPhaseName(selectedDate)
    const emoji = getMoonEmoji(selectedDate)

    setMoonDay(calculatedMoonDay)
    setMoonPhase(phaseName)
    setMoonEmoji(emoji)
  }, [date])

  const resetForm = (newDate: string) => {
    const selectedDate = new Date(newDate)
    const calculatedMoonDay = getMoonDay(selectedDate)
    const phaseName = getMoonPhaseName(selectedDate)
    const emoji = getMoonEmoji(selectedDate)

    setMoonDay(calculatedMoonDay)
    setMoonPhase(phaseName)
    setMoonEmoji(emoji)
    setSelectedColors([])
    setMood(5)
    setProductivity(5)
    setSelectedFoods([])
    setEntryId(null)
  }

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const handleFoodToggle = (food: string) => {
    setSelectedFoods((prev) => (prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (selectedColors.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select at least one color",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create entry data
    const entryData = {
      id: entryId, // Will be null for new entries
      date,
      moonDay,
      moonPhase,
      colors: selectedColors,
      mood,
      productivity,
      foods: selectedFoods.join(", "),
      isUpdate: isEditing,
    }

    // Simulate API call
    setTimeout(() => {
      onComplete(entryData)
      setIsSubmitting(false)

      // Show appropriate toast
      toast({
        title: isEditing ? "Entry updated" : "Entry saved",
        description: isEditing ? "Your entry has been updated successfully" : "Your entry has been saved successfully",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moon-day" className="flex items-center gap-2">
            Moon Day {moonEmoji && <span className="text-lg">{moonEmoji}</span>}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="moon-day"
              type="number"
              min={1}
              max={30}
              value={moonDay}
              onChange={(e) => setMoonDay(Number.parseInt(e.target.value))}
              className="w-24"
              readOnly
            />
            <span className="text-sm text-muted-foreground">{moonPhase}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Colors Worn</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {colorOptions.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorToggle(color)}
              />
              <Label htmlFor={`color-${color}`}>{color}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood">Mood (1-10): {mood}</Label>
        <Slider id="mood" min={1} max={10} step={1} value={[mood]} onValueChange={(value) => setMood(value[0])} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productivity">Productivity (1-10): {productivity}</Label>
        <Slider
          id="productivity"
          min={1}
          max={10}
          step={1}
          value={[productivity]}
          onValueChange={(value) => setProductivity(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Foods Eaten</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3">
          {foodCategories.map((food) => (
            <div key={food} className="flex items-center space-x-2">
              <Checkbox
                id={`food-${food}`}
                checked={selectedFoods.includes(food)}
                onCheckedChange={() => handleFoodToggle(food)}
              />
              <Label htmlFor={`food-${food}`}>{food}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (isEditing ? "Updating..." : "Saving...") : isEditing ? "Update Entry" : "Save Entry"}
      </Button>
    </form>
  )
}

