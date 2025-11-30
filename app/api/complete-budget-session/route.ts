import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Mark session as completed
    const { error } = await supabase
      .from("budget_sessions")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    if (error) {
      console.error("Error completing session:", error)
      return NextResponse.json({ error: "Failed to complete session" }, { status: 500 })
    }

    try {
      const analysisResponse = await fetch(`${request.url.split("/api")[0]}/api/analyze-budget-consensus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      if (!analysisResponse.ok) {
        console.error("[v0] Consensus analysis failed, but session was completed")
      } else {
        console.log("[v0] Consensus analysis completed successfully")
      }
    } catch (analysisError) {
      console.error("[v0] Error triggering consensus analysis:", analysisError)
      // Don't fail the request if consensus analysis fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in complete-budget-session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
