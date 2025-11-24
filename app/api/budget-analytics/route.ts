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

    // Get session counts
    const { data: sessions, error: sessionsError } = await supabase.from("budget_sessions").select(`
        id, completed, final_balance, total_spending, total_revenue,
        user_feedback (political_affiliation)
      `)

    if (sessionsError) throw sessionsError

    const totalSessions = sessions?.length || 0
    const completedSessions = sessions?.filter((s) => s.completed).length || 0

    // Calculate average balance from completed sessions
    const completedSessionsData = sessions?.filter((s) => s.completed && s.final_balance !== null) || []

    const partyStats: Record<string, { count: number; totalDeficit: number }> = {}

    completedSessionsData.forEach((session) => {
      const party = session.user_feedback?.[0]?.political_affiliation || "unknown"
      if (!partyStats[party]) partyStats[party] = { count: 0, totalDeficit: 0 }

      partyStats[party].count++
      partyStats[party].totalDeficit += Number(session.final_balance)
    })

    const avgDeficitByParty: Record<string, number> = {}
    Object.entries(partyStats).forEach(([party, stats]) => {
      if (stats.count > 0) {
        avgDeficitByParty[party] = Math.round(stats.totalDeficit / stats.count)
      }
    })

    const averageBalance =
      completedSessionsData.length > 0
        ? completedSessionsData.reduce((sum, s) => sum + Number(s.final_balance), 0) / completedSessionsData.length
        : 0

    // Categorize budget approaches
    let spendingFocused = 0
    let revenueFocused = 0
    let balanced = 0

    completedSessionsData.forEach((session) => {
      const spending = Number(session.total_spending) || 0
      const revenue = Number(session.total_revenue) || 0
      const spendingChange = Math.abs(spending - 4708)
      const revenueChange = Math.abs(revenue - 4975)

      if (spendingChange > revenueChange * 1.5) {
        spendingFocused++
      } else if (revenueChange > spendingChange * 1.5) {
        revenueFocused++
      } else {
        balanced++
      }
    })

    // Get popular policy choices
    const { data: configs, error: configsError } = await supabase
      .from("budget_configs")
      .select("session_id, category, value")
      .in(
        "session_id",
        completedSessionsData.map((s) => s.id),
      )

    if (configsError) throw configsError

    const baselines: Record<string, number> = {
      defense: 816,
      healthcare: 1355,
      social_security: 1347,
      education: 80,
      infrastructure: 65,
      energy: 45,
      income_tax: 2044,
      corporate_tax: 420,
      payroll_tax: 1614,
    }

    const policyChanges: Record<string, { increased: number; decreased: number; total: number }> = {}

    configs?.forEach((config) => {
      const baseline = baselines[config.category] || 0
      const value = Number(config.value)
      const change = value - baseline

      if (!policyChanges[config.category]) {
        policyChanges[config.category] = { increased: 0, decreased: 0, total: 0 }
      }

      policyChanges[config.category].total++

      if (Math.abs(change) > 5) {
        if (change > 0) {
          policyChanges[config.category].increased++
        } else if (change < 0) {
          policyChanges[config.category].decreased++
        }
      }
    })

    const popularPolicies = Object.entries(policyChanges)
      .map(([category, counts]) => {
        const supportCount = Math.max(counts.increased, counts.decreased)
        const action = counts.decreased > counts.increased ? "Cuts" : "Increase"
        const categoryName = category
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        return {
          policy_name: `${categoryName} ${action}`,
          support_count: supportCount,
          total_count: completedSessions,
          popularity_percentage: completedSessions > 0 ? Math.round((supportCount / completedSessions) * 100) : 0,
        }
      })
      .sort((a, b) => b.popularity_percentage - a.popularity_percentage)
      .slice(0, 10)

    return NextResponse.json({
      totalSessions,
      completedSessions,
      averageBalance: Math.round(averageBalance * 100) / 100,
      spendingVsRevenue: {
        spending_focused: spendingFocused,
        revenue_focused: revenueFocused,
        balanced: balanced,
      },
      popularPolicies,
      partisanBreakdown: {
        conservative: partyStats["conservative"]?.count || 0,
        moderate: partyStats["moderate"]?.count || 0,
        liberal: partyStats["liberal"]?.count || 0,
        progressive: partyStats["progressive"]?.count || 0,
        avg_deficit_by_party: avgDeficitByParty,
      },
    })
  } catch (error) {
    console.error("Failed to get analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
