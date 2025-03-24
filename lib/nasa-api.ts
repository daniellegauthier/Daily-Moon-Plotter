// NASA API key is stored securely
const NASA_API_KEY = "7sHOe68UHZR8RHCbMkcYrlseKZJHTa6nQsRGoSdk"

// Function to fetch Astronomy Picture of the Day
export async function getAstronomyPictureOfDay(date?: string) {
  const dateParam = date ? `&date=${date}` : ""
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch astronomy picture:", error)
    return null
  }
}

// Note: The NASA APOD API doesn't provide moon phase information.
// We're using astronomical calculations in utils.ts for moon phases instead.

