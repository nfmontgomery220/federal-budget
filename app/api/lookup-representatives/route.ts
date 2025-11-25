import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  try {
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

    // Parse the response from whoismyrepresentative.com
    const representatives = parseWhoIsMyRepResponse(data)

    return NextResponse.json({ representatives })
  } catch (error) {
    console.error("[v0] Error fetching representatives:", error)
    return NextResponse.json({ error: "Service temporarily unavailable", representatives: [] }, { status: 500 })
  }
}

function parseWhoIsMyRepResponse(data: any) {
  const reps: any[] = []

  if (!data.results || !Array.isArray(data.results)) {
    return reps
  }

  for (const member of data.results) {
    // Determine chamber based on the response
    const chamber = member.office?.toLowerCase().includes("senator") ? "Senate" : "House"

    reps.push({
      id: `${chamber.toLowerCase()}-${member.name?.replace(/\s+/g, "-").toLowerCase() || "unknown"}`,
      name: member.name || "Unknown",
      party: member.party || "Unknown",
      chamber,
      state: member.state || "",
      district: member.district || (chamber === "House" ? member.district : undefined),
      phone: member.phone || "",
      email: "", // whoismyrepresentative.com doesn't provide emails
      website: member.link || "",
      photoUrl: "", // No photo URLs from this API
    })
  }

  return reps
}
