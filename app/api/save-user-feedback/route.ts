import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, feedback } = body

    if (!sessionId || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save user feedback
    const { error } = await supabase.from("user_feedback").insert({
      session_id: sessionId,
      political_affiliation: feedback.politicalAffiliation,
      income_bracket: feedback.incomeBracket,
      age_range: feedback.ageRange,
      comments: feedback.comments,
      satisfaction: feedback.satisfaction,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving feedback:", error)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in save-user-feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
