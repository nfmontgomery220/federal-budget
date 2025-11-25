import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  try {
    // Use Google Civic Information API (free for basic lookups)
    const apiKey = process.env.GOOGLE_CIVIC_API_KEY || ""
    const address = `${zip}, USA`

    // API works without key but has rate limits; add key for production
    const url = apiKey
      ? `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&levels=country&roles=legislatorUpperBody&roles=legislatorLowerBody&key=${apiKey}`
      : `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&levels=country&roles=legislatorUpperBody&roles=legislatorLowerBody`

    const response = await fetch(url)

    if (!response.ok) {
      console.error("[v0] Google Civic API error:", response.status, await response.text())
      // Fallback to simplified lookup if API fails
      return getFallbackRepresentatives(zip)
    }

    const data = await response.json()
    const representatives = parseGoogleCivicResponse(data)

    return NextResponse.json({ representatives })
  } catch (error) {
    console.error("[v0] Error fetching representatives:", error)
    return getFallbackRepresentatives(zip)
  }
}

function parseGoogleCivicResponse(data: any) {
  const reps: any[] = []

  if (!data.offices || !data.officials) {
    return reps
  }

  for (const office of data.offices) {
    const officeName = office.name.toLowerCase()
    let chamber: "House" | "Senate" | null = null

    if (officeName.includes("senate") || officeName.includes("senator")) {
      chamber = "Senate"
    } else if (officeName.includes("house") || officeName.includes("representative")) {
      chamber = "House"
    }

    if (!chamber) continue

    for (const index of office.officialIndices || []) {
      const official = data.officials[index]
      if (!official) continue

      const phone = official.phones?.[0] || ""
      const website = official.urls?.[0] || ""
      const email = official.emails?.[0] || ""

      reps.push({
        id: `${chamber.toLowerCase()}-${official.name.replace(/\s+/g, "-")}`,
        name: official.name,
        party: official.party || "Unknown",
        chamber,
        state: "", // Google API doesn't always provide state explicitly
        district: chamber === "House" ? office.name.match(/\d+/)?.[0] || "" : undefined,
        phone,
        email,
        website,
        photoUrl: official.photoUrl,
      })
    }
  }

  return reps
}

// Fallback when API is unavailable or rate limited
function getFallbackRepresentatives(zip: string) {
  console.log("[v0] Using fallback representative lookup for ZIP:", zip)

  return NextResponse.json({
    representatives: [],
    error: "Unable to lookup representatives at this time. Please try again later.",
    fallback: true,
  })
}
