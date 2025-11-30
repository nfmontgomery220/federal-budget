import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const CONGRESS_API_KEY = process.env.CONGRESS_GOV_API_KEY
const CURRENT_CONGRESS = 119 // 2025-2026

export async function POST() {
  try {
    if (!CONGRESS_API_KEY) {
      return NextResponse.json({ error: "Congress.gov API key not configured" }, { status: 500 })
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    console.log("[v0] Fetching members from Congress.gov API...")

    const response = await fetch(
      `https://api.congress.gov/v3/member/congress/${CURRENT_CONGRESS}?currentMember=true&format=json&limit=250&api_key=${CONGRESS_API_KEY}`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Congress.gov API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const allMembers = data.members || []

    console.log(`[v0] Found ${allMembers.length} members to process`)

    const insertData = allMembers.map((member: any) => {
      const chamber = member.district ? "house" : "senate"

      // Generate office email based on chamber
      const officeEmail =
        chamber === "house" ? `${member.bioguideId}@mail.house.gov` : `${member.bioguideId}@mail.senate.gov`

      return {
        bioguide_id: member.bioguideId,
        state: member.state,
        district: member.district || null,
        chamber: chamber,
        party: member.partyName?.[0] || member.party || null,
        current_name: member.name || `${member.firstName || ""} ${member.lastName || ""}`.trim(),
        office_email: officeEmail,
        office_phone: null,
        dc_office_address: null,
        congress_gov_url: member.url || `https://api.congress.gov/v3/member/${member.bioguideId}`,
        term_start: member.terms?.item?.[0]?.startYear ? `${member.terms.item[0].startYear}-01-03` : null,
        term_end: member.terms?.item?.[0]?.endYear ? `${member.terms.item[0].endYear}-01-03` : null,
        data_source: "congress.gov",
      }
    })

    console.log(`[v0] Inserting ${insertData.length} members into database...`)

    // Clear existing data
    await supabase.from("congress_members").delete().neq("bioguide_id", "")

    // Batch insert
    const { error: insertError } = await supabase.from("congress_members").insert(insertData)

    if (insertError) {
      console.error("[v0] Insert error:", insertError)
      throw insertError
    }

    console.log(`[v0] Successfully inserted ${insertData.length} members`)

    return NextResponse.json({
      success: true,
      membersPopulated: insertData.length,
      message: `Successfully populated ${insertData.length} members from Congress.gov`,
    })
  } catch (error: any) {
    console.error("[v0] Population error:", error.message)
    return NextResponse.json({ error: error.message || "Failed to populate congress data" }, { status: 500 })
  }
}
