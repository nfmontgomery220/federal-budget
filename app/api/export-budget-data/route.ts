import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: sessions, error } = await supabase
      .from("budget_sessions")
      .select(`
        id, created_at, completed, scenario_name, final_balance, total_spending, total_revenue,
        user_feedback (
          political_affiliation, income_bracket, difficulty_rating, would_support_plan
        ),
        budget_configs (
          category, value
        )
      `)
      .eq("completed", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    if (!sessions || sessions.length === 0) {
      return new Response("No data available", {
        headers: { "Content-Type": "text/csv" },
      })
    }

    // Create CSV
    const headers = [
      "Session ID",
      "Date",
      "Scenario",
      "Final Balance",
      "Total Spending",
      "Total Revenue",
      "Political Affiliation",
      "Income Bracket",
      "Difficulty Rating",
      "Support Plan",
      "Defense Spending",
      "Social Security",
      "Healthcare",
      "Education",
      "Income Tax",
      "Corporate Tax",
    ].join(",")

    const rows = sessions.map((session) => {
      const feedback = session.user_feedback?.[0] || {}
      const configs = session.budget_configs || []

      const getVal = (cat: string) => configs.find((c: any) => c.category === cat)?.value || ""

      return [
        session.id,
        new Date(session.created_at).toISOString().split("T")[0],
        `"${session.scenario_name || ""}"`,
        session.final_balance,
        session.total_spending,
        session.total_revenue,
        feedback.political_affiliation || "Unknown",
        feedback.income_bracket || "Unknown",
        feedback.difficulty_rating || "",
        feedback.would_support_plan ? "Yes" : "No",
        getVal("defense"),
        getVal("social_security"),
        getVal("healthcare"),
        getVal("education"),
        getVal("income_tax"),
        getVal("corporate_tax"),
      ].join(",")
    })

    const csv = [headers, ...rows].join("\n")

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="budget-data-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export failed:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
