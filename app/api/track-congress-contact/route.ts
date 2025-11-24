import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { zipCode, representatives, budgetSummary } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase credentials")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store contact event
    const { error } = await supabase.from("congress_contacts").insert({
      zip_code: zipCode,
      representatives: representatives.map((r: any) => ({
        id: r.id,
        name: r.name,
        chamber: r.chamber,
      })),
      budget_summary: budgetSummary,
      contacted_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Failed to track contact:", error)
      return NextResponse.json({ error: "Failed to save contact" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error tracking congress contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
