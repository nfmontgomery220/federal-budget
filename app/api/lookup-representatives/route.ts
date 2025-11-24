import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  // Use Civic Information API (free, no API key required for basic lookups)
  // In production, you would use a more robust solution like:
  // - Google Civic Information API
  // - OpenStates API
  // - congress.gov scraping

  // For now, return mock data based on ZIP code
  // This should be replaced with actual API integration
  const mockRepresentatives = generateMockReps(zip)

  return NextResponse.json({ representatives: mockRepresentatives })
}

function generateMockReps(zip: string): any[] {
  // Extract state from ZIP (simplified)
  const zipNum = Number.parseInt(zip)
  let state = "Unknown"
  let district = "1"

  if (zipNum >= 10000 && zipNum < 20000) {
    state = "NY"
    district = Math.floor((zipNum - 10000) / 1000).toString()
  } else if (zipNum >= 90000) {
    state = "CA"
    district = Math.floor((zipNum - 90000) / 1000).toString()
  } else if (zipNum >= 60000 && zipNum < 70000) {
    state = "IL"
    district = Math.floor((zipNum - 60000) / 1000).toString()
  } else {
    state = "VA"
    district = "8"
  }

  return [
    {
      id: `house-${state}-${district}`,
      name: `Rep. John Smith`,
      party: "Democrat",
      chamber: "House" as const,
      state,
      district,
      phone: "(202) 225-1234",
      email: "representative@mail.house.gov",
      website: `https://smith.house.gov`,
    },
    {
      id: `senate-${state}-1`,
      name: `Sen. Jane Doe`,
      party: "Republican",
      chamber: "Senate" as const,
      state,
      phone: "(202) 224-5678",
      email: "senator_doe@senate.gov",
      website: `https://doe.senate.gov`,
    },
    {
      id: `senate-${state}-2`,
      name: `Sen. Bob Johnson`,
      party: "Democrat",
      chamber: "Senate" as const,
      state,
      phone: "(202) 224-9012",
      email: "senator_johnson@senate.gov",
      website: `https://johnson.senate.gov`,
    },
  ]
}
