import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")
  const address = searchParams.get("address")

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP code" }, { status: 400 })
  }

  try {
    // First, get district from ZIP using external API
    const district = await getDistrictFromZip(zip)

    if (!district) {
      return NextResponse.json(
        {
          error: "Unable to determine congressional district",
          representatives: [],
        },
        { status: 404 },
      )
    }

    console.log(`[v0] ZIP ${zip} is in district ${district.state}-${district.district || "Senate"}`)

    // Query our own database for accurate, verified representatives
    const representatives = await getRepresentativesFromDatabase(district.state, district.district)

    if (representatives.length > 0) {
      console.log(`[v0] ✓ Found ${representatives.length} representatives in our database`)
      return NextResponse.json({
        representatives,
        source: "FiscalClarity Database (Verified)",
        timestamp: new Date().toISOString(),
        district: `${district.state}${district.district ? `-${district.district}` : ""}`,
      })
    }

    // Fallback if database is empty
    console.log("[v0] ⚠ Database empty, falling back to external APIs")
    return await fallbackToExternalAPI(zip, address)
  } catch (error) {
    console.error("[v0] ✗ Error fetching representatives:", error)
    return NextResponse.json(
      {
        error: "Service temporarily unavailable",
        representatives: [],
      },
      { status: 500 },
    )
  }
}

async function getDistrictFromZip(zip: string): Promise<{ state: string; district?: string } | null> {
  try {
    const url = `https://whoismyrepresentative.com/getall_mems.php?zip=${zip}&output=json`
    const response = await fetch(url, {
      headers: { "User-Agent": "FiscalClarity/1.0" },
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.results || data.results.length === 0) return null

    // Get state from first result
    const firstMember = data.results[0]
    const state = firstMember.state

    // Find House member to get district
    const houseMember = data.results.find((m: any) => m.office?.toLowerCase().includes("representative"))

    return {
      state,
      district: houseMember?.district || undefined,
    }
  } catch (error) {
    console.error("[v0] Error getting district from ZIP:", error)
    return null
  }
}

async function getRepresentativesFromDatabase(state: string, district?: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get House representative for this district
  const houseQuery = supabase.from("congress_members").select("*").eq("chamber", "house").eq("state", state)

  if (district) {
    houseQuery.eq("district", district.padStart(2, "0"))
  }

  const { data: houseData, error: houseError } = await houseQuery

  if (houseError) {
    console.error("[v0] Database error fetching House member:", houseError)
  }

  // Get both Senators for this state
  const { data: senateData, error: senateError } = await supabase
    .from("congress_members")
    .select("*")
    .eq("chamber", "senate")
    .eq("state", state)

  if (senateError) {
    console.error("[v0] Database error fetching Senators:", senateError)
  }

  const allMembers = [...(houseData || []), ...(senateData || [])]

  return allMembers.map((member) => ({
    id: member.bioguide_id,
    name: member.current_name,
    party: member.party,
    chamber: member.chamber === "senate" ? "Senate" : "House",
    state: member.state,
    district: member.district,
    phone: member.office_phone || "",
    email: member.office_email,
    website: member.congress_gov_url || `https://www.congress.gov/member/${member.bioguide_id}`,
    photoUrl: `https://bioguide.congress.gov/bioguide/photo/${member.bioguide_id[0]}/${member.bioguide_id}.jpg`,
    officeAddress: member.dc_office_address,
    contactForm: member.congress_gov_url ? `${member.congress_gov_url}/contact` : undefined,
    dataSource: "verified-database",
    lastUpdated: member.last_updated,
  }))
}

async function fallbackToExternalAPI(zip: string, address?: string) {
  const googleApiKey = process.env.Google_Civic_api_key
  const lookupAddress = address || zip

  if (googleApiKey) {
    try {
      const googleUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(lookupAddress)}&key=${googleApiKey}`
      const googleResponse = await fetch(googleUrl)

      if (googleResponse.ok) {
        const data = await googleResponse.json()
        const representatives = parseGoogleCivicResponse(data)

        return NextResponse.json({
          representatives,
          source: "Google Civic Information API (Fallback)",
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.log("[v0] Google API fallback failed:", error)
    }
  }

  // Final fallback
  const url = `https://whoismyrepresentative.com/getall_mems.php?zip=${zip}&output=json`
  const response = await fetch(url)
  const data = await response.json()
  const representatives = parseWhoIsMyRepResponse(data)

  return NextResponse.json({
    representatives,
    source: "whoismyrepresentative.com (May be outdated)",
    timestamp: new Date().toISOString(),
    warning: "Using fallback data. Database needs population.",
  })
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
