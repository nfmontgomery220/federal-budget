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
    console.log(`[v0] Looking up representatives for ZIP: ${zip}`)

    const cachedDistrict = await getCachedDistrict(zip)

    let state: string
    let district: string | null

    if (cachedDistrict) {
      console.log(`[v0] ✓ Cache hit for ZIP ${zip}: ${cachedDistrict.state}-${cachedDistrict.congressional_district}`)
      state = cachedDistrict.state
      district = cachedDistrict.congressional_district
    } else {
      console.log(`[v0] Cache miss for ZIP ${zip}, calling Cicero API...`)

      const ciceroResult = await lookupDistrictViaCicero(zip, address)

      if (!ciceroResult) {
        return NextResponse.json(
          { error: "Unable to determine congressional district", representatives: [] },
          { status: 404 },
        )
      }

      state = ciceroResult.state
      district = ciceroResult.district

      // Cache the result for future lookups (free next time)
      await cacheDistrict(zip, state, district, ciceroResult.lat, ciceroResult.lon)
      console.log(`[v0] ✓ Cached ${zip} → ${state}-${district}`)
    }

    const representatives = await getRepresentativesFromDatabase(state, district)

    if (representatives.length === 0) {
      return NextResponse.json(
        {
          error: "No representatives found in database. Please run Populate Database.",
          representatives: [],
        },
        { status: 404 },
      )
    }

    console.log(
      `[v0] ✓ Found ${representatives.length} representatives (${district ? "exact district" : "state-wide"})`,
    )

    return NextResponse.json({
      representatives,
      source: "FiscalClarity Verified Database + Cicero API",
      timestamp: new Date().toISOString(),
      state,
      district,
      cached: !!cachedDistrict,
    })
  } catch (error) {
    console.error("[v0] Error fetching representatives:", error)
    return NextResponse.json({ error: "Lookup failed. Please try again.", representatives: [] }, { status: 500 })
  }
}

async function getCachedDistrict(zip: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return null

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase.from("zip_district_cache").select("*").eq("zip_code", zip).maybeSingle()

  if (error || !data) return null

  return data
}

async function lookupDistrictViaCicero(zip: string, address?: string | null) {
  const ciceroApiKey = process.env.MELISSA_CICERO_API_KEY

  if (!ciceroApiKey) {
    console.error("[v0] Missing MELISSA_CICERO_API_KEY")
    return null
  }

  try {
    const searchLocation = address || zip
    const ciceroUrl = `https://app.cicerodata.com/v3.1/official?search_loc=${encodeURIComponent(searchLocation)}&district_type=NATIONAL_LOWER&format=json&key=${ciceroApiKey}`

    console.log(`[v0] Calling Cicero API with search_loc: ${searchLocation}`)

    const response = await fetch(ciceroUrl, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Cicero API error ${response.status}:`, errorText)
      return null
    }

    const data = await response.json()
    console.log(`[v0] Cicero API response:`, JSON.stringify(data).substring(0, 500))

    if (!data.response?.results?.officials || data.response.results.officials.length === 0) {
      console.error("[v0] No officials returned from Cicero")
      return null
    }

    const official = data.response.results.officials.find(
      (off: any) => off.district?.district_type === "NATIONAL_LOWER",
    )

    if (!official) {
      console.error("[v0] No House representative found in Cicero response")
      return null
    }

    const state = official.district?.state || official.addresses?.[0]?.state
    const districtLabel = official.district?.label || official.district?.district_id || ""
    const districtMatch = districtLabel.match(/(\d+)/)
    const districtNum = districtMatch ? districtMatch[1].padStart(2, "0") : null

    if (!state || !districtNum) {
      console.error("[v0] Unable to parse state/district from Cicero:", official.district)
      return null
    }

    console.log(`[v0] ✓ Cicero returned: ${state}-${districtNum}`)

    return {
      state,
      district: districtNum,
      lat: data.response?.results?.candidates?.[0]?.y,
      lon: data.response?.results?.candidates?.[0]?.x,
    }
  } catch (error) {
    console.error("[v0] Cicero API call failed:", error)
    return null
  }
}

async function cacheDistrict(zip: string, state: string, district: string, lat?: number, lon?: number) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) return

  const supabase = createClient(supabaseUrl, supabaseKey)

  await supabase.from("zip_district_cache").upsert({
    zip_code: zip,
    state,
    congressional_district: district,
    latitude: lat,
    longitude: lon,
    source: "cicero_api",
  })
}

async function getRepresentativesFromDatabase(state: string, district?: string | null) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const representatives = []

  if (district) {
    const { data: houseData, error: houseError } = await supabase
      .from("congress_members")
      .select("*")
      .eq("chamber", "house")
      .eq("state", state)
      .or(`district.eq.${district},district.eq.${Number.parseInt(district)}`)

    if (houseError) {
      console.error("[v0] Database error fetching House member:", houseError)
    } else if (houseData && houseData.length > 0) {
      representatives.push(...houseData)
    }
  }

  const { data: senateData, error: senateError } = await supabase
    .from("congress_members")
    .select("*")
    .eq("chamber", "senate")
    .eq("state", state)

  if (senateError) {
    console.error("[v0] Database error fetching Senators:", senateError)
  } else if (senateData) {
    representatives.push(...senateData)
  }

  console.log(`[v0] Database query: ${district ? `${state}-${district}` : state} → ${representatives.length} members`)

  return representatives.map((member) => ({
    id: member.bioguide_id,
    name: member.current_name,
    party: member.party,
    chamber: member.chamber === "senate" ? "Senate" : "House",
    state: member.state,
    district: member.district,
    phone: member.office_phone || "(202) 224-3121",
    email: member.office_email,
    website: `https://www.congress.gov/member/${member.bioguide_id}`,
    photoUrl: `https://bioguide.congress.gov/bioguide/photo/${member.bioguide_id[0]}/${member.bioguide_id}.jpg`,
    officeAddress: member.dc_office_address || "U.S. Capitol, Washington, DC 20515",
    contactForm: `https://www.congress.gov/member/${member.bioguide_id}/contact`,
    dataSource: "verified-database",
  }))
}
