import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")
  const address = searchParams.get("address")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  const googleApiKey = process.env.Google_Civic_api_key
  const lookupAddress = address || zip

  try {
    if (googleApiKey) {
      console.log("[v0] Attempting Google Civic API lookup for:", lookupAddress)

      try {
        const googleUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(lookupAddress)}&key=${googleApiKey}`

        const googleResponse = await fetch(googleUrl, {
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (googleResponse.ok) {
          const data = await googleResponse.json()
          const representatives = parseGoogleCivicResponse(data)
          console.log("[v0] ✓ Google Civic API SUCCESS - Found", representatives.length, "representatives")
          console.log("[v0] Representatives:", representatives.map((r) => `${r.name} (${r.chamber})`).join(", "))

          return NextResponse.json({
            representatives,
            source: "Google Civic Information API",
            timestamp: new Date().toISOString(),
            multipleDistricts: !address && representatives.length > 3,
          })
        } else {
          const errorData = await googleResponse.json().catch(() => ({}))
          console.log("[v0] ✗ Google Civic API failed with status:", googleResponse.status)
          console.log("[v0] Error details:", errorData.error?.message || "Unknown error")
        }
      } catch (googleError) {
        console.log("[v0] ✗ Google Civic API exception:", googleError)
      }
    } else {
      console.log("[v0] No Google API key configured, using fallback API")
    }

    console.log("[v0] Falling back to whoismyrepresentative.com API for ZIP:", zip)

    const url = `https://whoismyrepresentative.com/getall_mems.php?zip=${zip}&output=json`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "FiscalClarity/1.0",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.error("[v0] ✗ whoismyrepresentative.com API error:", response.status)
      return NextResponse.json({ error: "Unable to fetch representatives", representatives: [] }, { status: 500 })
    }

    const data = await response.json()
    const representatives = parseWhoIsMyRepResponse(data)

    console.log("[v0] ✓ Fallback API SUCCESS - Found", representatives.length, "representatives")
    console.log("[v0] Representatives:", representatives.map((r) => `${r.name} (${r.chamber})`).join(", "))

    return NextResponse.json({
      representatives,
      source: "whoismyrepresentative.com (Fallback - May have outdated data)",
      timestamp: new Date().toISOString(),
      multipleDistricts: false,
    })
  } catch (error) {
    console.error("[v0] ✗ Unexpected error fetching representatives:", error)
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

      const officeAddress = official.address?.[0]
        ? `${official.address[0].line1 || ""}, ${official.address[0].city || ""}, ${official.address[0].state || ""} ${official.address[0].zip || ""}`.trim()
        : undefined

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
        officeAddress,
        contactForm: official.urls?.[0] ? `${official.urls[0]}/contact` : undefined,
        dataSource: "google",
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
      officeAddress: undefined,
      contactForm: member.link ? `${member.link}/contact` : undefined,
      dataSource: "fallback",
    })
  }

  return reps
}
