import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, budgetData } = body

    if (!sessionId || !budgetData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save budget configuration
    const { error } = await supabase.from("budget_configs").insert({
      session_id: sessionId,
      total_spending: budgetData.totalSpending,
      total_revenue: budgetData.totalRevenue,
      deficit: budgetData.deficit,
      spending_breakdown: budgetData.spendingBreakdown,
      revenue_breakdown: budgetData.revenueBreakdown,
      approach: budgetData.approach || "mixed",
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving budget config:", error)
      return NextResponse.json({ error: "Failed to save budget configuration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in save-budget-config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
