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

    // Get top districts
    const { data: districtData } = await supabase
      .from("congress_district_stats")
      .select("district, contact_count")
      .order("contact_count", { ascending: false })
      .limit(5)

    // Calculate growth rate (mock for now)
    const growthRate = 12.3

    return NextResponse.json({
      totalContacts: totalContacts || 0,
      last24Hours: last24Hours || 0,
      topDistricts: districtData?.map((d) => ({ district: d.district, count: d.contact_count })) || [],
      growthRate,
    })
  } catch (error) {
    console.error("[v0] Error loading congress contact stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
