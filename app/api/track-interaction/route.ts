import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, interactionType, interactionData } = body

    if (!sessionId || !interactionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Track user interaction
    const { error } = await supabase.from("user_interactions").insert({
      session_id: sessionId,
      interaction_type: interactionType,
      interaction_data: interactionData,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error tracking interaction:", error)
      return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in track-interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
