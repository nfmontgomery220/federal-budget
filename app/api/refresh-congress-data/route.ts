// Admin endpoint to refresh congress members database from Congress.gov API
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const CONGRESS_GOV_API_KEY = process.env.CONGRESS_GOV_API_KEY || "2cV5vg8yEmz7gbHWEmTaCSN0Bcgw1CDA0AU7FJU3"
const CURRENT_CONGRESS = 119

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting Congress data refresh...")

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing database credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all members from Congress.gov API
    let allMembers: any[] = []
    let offset = 0
    const limit = 250

    while (true) {
      const url = `https://api.congress.gov/v3/member/congress/${CURRENT_CONGRESS}?api_key=${CONGRESS_GOV_API_KEY}&format=json&limit=${limit}&offset=${offset}`

      console.log(`[v0] Fetching batch at offset ${offset}...`)

      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Congress.gov API error:", response.status, errorText)
        return NextResponse.json({ error: `Congress.gov API error: ${response.status}` }, { status: response.status })
      }

      const data = await response.json()
      const members = data.members || []

      if (members.length === 0) break

      allMembers = [...allMembers, ...members]
      console.log(`[v0] Fetched ${members.length} members (total: ${allMembers.length})`)

      if (members.length < limit) break

      offset += limit
    }

    console.log(`[v0] Total members fetched: ${allMembers.length}`)

    // Transform and prepare for database
    const records = allMembers.map((member) => {
      const currentTerm = member.terms?.item?.[0]
      const chamber = currentTerm?.chamber?.toLowerCase() || "unknown"
      const district = member.district ? member.district.toString().padStart(2, "0") : null
      const lastName = member.name?.split(" ").pop()?.toLowerCase() || "unknown"

      return {
        bioguide_id: member.bioguideId,
        state: member.state,
        district: chamber === "house" ? district : null,
        chamber: chamber,
        party: member.party || "Unknown",
        office_email: chamber === "house" ? `${lastName}@mail.house.gov` : `${lastName}@senate.gov`,
        office_phone: member.addressInformation?.phoneNumber || null,
        dc_office_address: member.addressInformation?.officeAddress || null,
        current_name: member.name,
        term_start: currentTerm ? new Date(currentTerm.startYear, 0, 1) : null,
        term_end: currentTerm ? new Date(currentTerm.endYear, 11, 31) : null,
        congress_gov_url: `https://api.congress.gov/v3/member/${member.bioguideId}`,
        data_source: "congress.gov",
        last_updated: new Date().toISOString(),
      }
    })

    // Upsert to database
    console.log(`[v0] Inserting ${records.length} records...`)

    const { error } = await supabase.from("congress_members").upsert(records, {
      onConflict: "bioguide_id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const summary = {
      totalMembers: records.length,
      houseMembers: records.filter((r) => r.chamber === "house").length,
      senateMembers: records.filter((r) => r.chamber === "senate").length,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] ✓ Database refresh complete:", summary)

    return NextResponse.json({
      success: true,
      message: "Congress members database updated successfully",
      ...summary,
    })
  } catch (error) {
    console.error("[v0] Refresh failed:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
