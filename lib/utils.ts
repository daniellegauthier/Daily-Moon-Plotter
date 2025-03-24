import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a utility function to parse CSV data
export function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((header) => header.trim())

  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim())
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })

    return row
  })

  return { headers, data }
}

// Calculate moon phase (0-29.5) for a given date
export function getMoonPhase(date: Date): number {
  // Known new moon date for reference (January 1, 2000)
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0)

  // Lunar cycle is approximately 29.53059 days
  const lunarCycle = 29.53059

  // Calculate time difference in milliseconds
  const timeDiff = date.getTime() - knownNewMoon.getTime()

  // Convert to days
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

  // Calculate the moon's age (days since new moon)
  const moonAge = daysDiff % lunarCycle

  // Return moon age (0-29.53)
  return moonAge
}

// Get moon day (1-30) for a given date
export function getMoonDay(date: Date): number {
  const moonAge = getMoonPhase(date)
  // Convert to 1-30 scale and round
  return Math.round(moonAge) + 1
}

// Get moon phase name for a given date
export function getMoonPhaseName(date: Date): string {
  const moonAge = getMoonPhase(date)

  if (moonAge < 1) return "New Moon"
  if (moonAge < 7.4) return "Waxing Crescent"
  if (moonAge < 8.4) return "First Quarter"
  if (moonAge < 14.8) return "Waxing Gibbous"
  if (moonAge < 16.2) return "Full Moon"
  if (moonAge < 22.1) return "Waning Gibbous"
  if (moonAge < 23.1) return "Last Quarter"
  if (moonAge < 29.5) return "Waning Crescent"
  return "New Moon"
}

// Get moon emoji for a given date
export function getMoonEmoji(date: Date): string {
  const moonAge = getMoonPhase(date)

  if (moonAge < 1) return "🌑"
  if (moonAge < 7.4) return "🌒"
  if (moonAge < 8.4) return "🌓"
  if (moonAge < 14.8) return "🌔"
  if (moonAge < 16.2) return "🌕"
  if (moonAge < 22.1) return "🌖"
  if (moonAge < 23.1) return "🌗"
  if (moonAge < 29.5) return "🌘"
  return "🌑"
}

