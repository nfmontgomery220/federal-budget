import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get total contacts
    const { count: totalContacts } = await supabase
      .from("congress_contacts")
      .select("*", { count: "exact", head: true })

    // Get last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: last24Hours } = await supabase
      .from("congress_contacts")
      .select("*", { count: "exact", head: true })
      .gte("contacted_at", yesterday)

    const { data: contactsWithMembers } = await supabase.from("congress_contacts").select(`
        zip_code,
        congress_members!inner(state, district, chamber)
      `)

    // Aggregate by district/state
    const districtCounts = new Map<string, number>()

    contactsWithMembers?.forEach((contact: any) => {
      const member = contact.congress_members
      const key = member.chamber === "house" ? `${member.state}-${member.district}` : `${member.state} (Senate)`

      districtCounts.set(key, (districtCounts.get(key) || 0) + 1)
    })

    // Get top 5 districts
    const topDistricts = Array.from(districtCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([district, count]) => ({ district, count }))

    // Calculate growth rate (compare last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const { count: lastWeek } = await supabase
      .from("congress_contacts")
      .select("*", { count: "exact", head: true })
      .gte("contacted_at", sevenDaysAgo)

    const { count: previousWeek } = await supabase
      .from("congress_contacts")
      .select("*", { count: "exact", head: true })
      .gte("contacted_at", fourteenDaysAgo)
      .lt("contacted_at", sevenDaysAgo)

    const growthRate = previousWeek && previousWeek > 0 ? (((lastWeek || 0) - previousWeek) / previousWeek) * 100 : 0

    return NextResponse.json({
      totalContacts: totalContacts || 0,
      last24Hours: last24Hours || 0,
      topDistricts,
      growthRate: Math.round(growthRate * 10) / 10, // Round to 1 decimal
    })
  } catch (error) {
    console.error("[v0] Error loading congress contact stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
