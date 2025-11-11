import { createClient } from "@supabase/supabase-js"

export interface BudgetAnalytics {
  totalSessions: number
  completedSessions: number
  averageBalance: number
  spendingVsRevenue: {
    spending_focused: number
    revenue_focused: number
    balanced: number
  }
  popularPolicies: Array<{
    policy_name: string
    support_count: number
    total_count: number
    popularity_percentage: number
  }>
}

export interface UserFeedback {
  politicalAffiliation?: string
  incomeBracket?: string
  difficultyRating?: number
  comments?: string
  wouldSupportPlan?: boolean
}

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for admin operations")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function createBudgetSession(): Promise<string> {
  try {
    const response = await fetch("/api/create-budget-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error("Failed to create budget session:", error)
    throw error
  }
}

export async function saveBudgetConfig(sessionId: string, category: string, value: number): Promise<void> {
  try {
    const supabase = getAdminClient()
    const { error } = await supabase.from("budget_configs").insert({
      session_id: sessionId,
      category: category,
      value: value,
    })

    if (error) throw error
  } catch (error) {
    console.error(`Failed to save config for session ${sessionId}:`, error)
  }
}

export async function completeSession(
  sessionId: string,
  scenarioName: string,
  balance: number,
  spending: number,
  revenue: number,
): Promise<void> {
  try {
    const supabase = getAdminClient()
    const { error } = await supabase
      .from("budget_sessions")
      .update({
        completed: true,
        scenario_name: scenarioName,
        final_balance: balance,
        total_spending: spending,
        total_revenue: revenue,
      })
      .eq("id", sessionId)

    if (error) throw error
  } catch (error) {
    console.error(`Failed to complete session ${sessionId}:`, error)
  }
}

export async function trackInteraction(
  sessionId: string,
  action: string,
  category?: string,
  value?: string,
): Promise<void> {
  try {
    const supabase = getAdminClient()
    const { error } = await supabase.from("user_interactions").insert({
      session_id: sessionId,
      action: action,
      details: { category, value },
    })

    if (error) throw error
  } catch (error) {
    console.error(`Failed to track interaction for session ${sessionId}:`, error)
  }
}

export async function saveUserFeedback(sessionId: string, feedback: UserFeedback): Promise<void> {
  try {
    const supabase = getAdminClient()
    const { error } = await supabase.from("user_feedback").insert({
      session_id: sessionId,
      political_affiliation: feedback.politicalAffiliation,
      income_bracket: feedback.incomeBracket,
      difficulty_rating: feedback.difficultyRating,
      comments: feedback.comments,
      would_support_plan: feedback.wouldSupportPlan,
    })

    if (error) throw error
  } catch (error) {
    console.error(`Failed to save feedback for session ${sessionId}:`, error)
  }
}

export async function getBudgetAnalytics(): Promise<BudgetAnalytics> {
  try {
    const supabase = getAdminClient()

    // Get session counts
    const { data: sessions, error: sessionsError } = await supabase
      .from("budget_sessions")
      .select("id, completed, final_balance, total_spending, total_revenue")

    if (sessionsError) throw sessionsError

    const totalSessions = sessions?.length || 0
    const completedSessions = sessions?.filter((s) => s.completed).length || 0

    // Calculate average balance from completed sessions
    const completedSessionsData = sessions?.filter((s) => s.completed && s.final_balance !== null) || []
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
      const spendingChange = Math.abs(spending - 4708) // baseline spending
      const revenueChange = Math.abs(revenue - 4975) // baseline revenue

      if (spendingChange > revenueChange * 1.5) {
        spendingFocused++
      } else if (revenueChange > spendingChange * 1.5) {
        revenueFocused++
      } else {
        balanced++
      }
    })

    // Get popular policy choices from budget_configs
    const { data: configs, error: configsError } = await supabase
      .from("budget_configs")
      .select("session_id, category, value")
      .in(
        "session_id",
        completedSessionsData.map((s) => s.id),
      )

    if (configsError) throw configsError

    // Define baseline values for comparison
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

    // Count policy choices (changes from baseline)
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
        // Only count significant changes
        if (change > 0) {
          policyChanges[config.category].increased++
        } else if (change < 0) {
          policyChanges[config.category].decreased++
        }
      }
    })

    // Create popular policies array
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

    return {
      totalSessions,
      completedSessions,
      averageBalance: Math.round(averageBalance * 100) / 100,
      spendingVsRevenue: {
        spending_focused: spendingFocused,
        revenue_focused: revenueFocused,
        balanced: balanced,
      },
      popularPolicies,
    }
  } catch (error) {
    console.error("Failed to get budget analytics:", error)
    // Return empty analytics on error
    return {
      totalSessions: 0,
      completedSessions: 0,
      averageBalance: 0,
      spendingVsRevenue: {
        spending_focused: 0,
        revenue_focused: 0,
        balanced: 0,
      },
      popularPolicies: [],
    }
  }
}
