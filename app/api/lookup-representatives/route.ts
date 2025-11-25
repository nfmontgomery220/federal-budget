import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  const googleApiKey = process.env.Google_Civic_api_key

  try {
    if (googleApiKey) {
      try {
        const googleUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(zip + ", USA")}&levels=country&roles=legislatorUpperBody&roles=legislatorLowerBody&key=${googleApiKey}`

        const googleResponse = await fetch(googleUrl)

        if (googleResponse.ok) {
          const data = await googleResponse.json()
          const representatives = parseGoogleCivicResponse(data)
          return NextResponse.json({ representatives })
        } else {
          // Consume the error response to prevent hanging
          const errorData = await googleResponse.json().catch(() => ({}))
          console.log("[v0] Google Civic API not available, falling back to free API:", googleResponse.status)
        }
      } catch (googleError) {
        console.log("[v0] Google Civic API error, falling back to free API")
      }
    }

    const url = `https://whoismyrepresentative.com/getall_mems.php?zip=${zip}&output=json`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "FiscalClarity/1.0",
      },
    })

    if (!response.ok) {
      console.error("[v0] whoismyrepresentative.com API error:", response.status)
      return NextResponse.json({ error: "Unable to fetch representatives", representatives: [] }, { status: 500 })
    }

    const data = await response.json()
    const representatives = parseWhoIsMyRepResponse(data)

    return NextResponse.json({ representatives })
  } catch (error) {
    console.error("[v0] Error fetching representatives:", error)
    return NextResponse.json({ error: "Service temporarily unavailable", representatives: [] }, { status: 500 })
  }
}

function parseGoogleCivicResponse(data: any) {
  const reps: any[] = []

  if (!data.offices || !data.officials) {
    return reps
  }

  for (const office of data.offices) {
    const isSenate = office.name?.toLowerCase().includes("senate")
    const isHouse = office.name?.toLowerCase().includes("representative")

    if (!isSenate && !isHouse) continue

    const chamber = isSenate ? "Senate" : "House"

    for (const officialIndex of office.officialIndices || []) {
      const official = data.officials[officialIndex]
      if (!official) continue

      reps.push({
        id: `${chamber.toLowerCase()}-${official.name?.replace(/\s+/g, "-").toLowerCase() || "unknown"}`,
        name: official.name || "Unknown",
        party: official.party || "Unknown",
        chamber,
        state: data.normalizedInput?.state || "",
        district: !isSenate ? office.name?.match(/District (\d+)/)?.[1] : undefined,
        phone: official.phones?.[0] || "",
        email: official.emails?.[0] || "",
        website: official.urls?.[0] || "",
        photoUrl: official.photoUrl || "",
      })
    }
  }

  return reps
}

function parseWhoIsMyRepResponse(data: any) {
  const reps: any[] = []

  if (!data.results || !Array.isArray(data.results)) {
    return reps
  }

  for (const member of data.results) {
    const chamber = member.office?.toLowerCase().includes("senator") ? "Senate" : "House"

    reps.push({
      id: `${chamber.toLowerCase()}-${member.name?.replace(/\s+/g, "-").toLowerCase() || "unknown"}`,
      name: member.name || "Unknown",
      party: member.party || "Unknown",
      chamber,
      state: member.state || "",
      district: member.district || (chamber === "House" ? member.district : undefined),
      phone: member.phone || "",
      email: "",
      website: member.link || "",
      photoUrl: "",
    })
  }

  return reps
}
