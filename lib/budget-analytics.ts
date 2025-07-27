import { supabase } from "./supabase"

export interface BudgetSession {
  id: string
  created_at: string
  completed: boolean
  scenario_name?: string
  final_balance?: number
  total_spending?: number
  total_revenue?: number
}

export interface BudgetConfig {
  session_id: string
  category: string
  value: number
  created_at: string
}

export interface UserFeedback {
  session_id: string
  politicalAffiliation?: string
  incomeBracket?: string
  difficultyRating?: number
  comments?: string
  wouldSupportPlan?: boolean
}

export interface PolicyPopularity {
  policy_name: string
  support_count: number
  total_count: number
  popularity_percentage: number
}

export interface BudgetAnalytics {
  totalSessions: number
  completedSessions: number
  averageBalance: number
  popularPolicies: PolicyPopularity[]
  spendingVsRevenue: {
    spending_focused: number
    revenue_focused: number
    balanced: number
  }
}

export async function createBudgetSession(): Promise<string> {
  try {
    const response = await fetch("/api/create-budget-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to create session")
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error("Error creating budget session:", error)
    throw error
  }
}

export async function saveBudgetConfig(sessionId: string, category: string, value: number) {
  try {
    const { error } = await supabase.from("budget_configs").upsert({
      session_id: sessionId,
      category,
      value,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Error saving budget config:", error)
    throw error
  }
}

export async function completeSession(
  sessionId: string,
  scenarioName: string,
  finalBalance: number,
  totalSpending: number,
  totalRevenue: number,
) {
  try {
    const { error } = await supabase
      .from("budget_sessions")
      .update({
        completed: true,
        scenario_name: scenarioName,
        final_balance: finalBalance,
        total_spending: totalSpending,
        total_revenue: totalRevenue,
      })
      .eq("id", sessionId)

    if (error) throw error
  } catch (error) {
    console.error("Error completing session:", error)
    throw error
  }
}

export async function saveUserFeedback(sessionId: string, feedback: UserFeedback) {
  try {
    const { error } = await supabase.from("user_feedback").insert({
      session_id: sessionId,
      political_affiliation: feedback.politicalAffiliation,
      income_bracket: feedback.incomeBracket,
      difficulty_rating: feedback.difficultyRating,
      comments: feedback.comments,
      would_support_plan: feedback.wouldSupportPlan,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Error saving user feedback:", error)
    throw error
  }
}

export async function trackInteraction(sessionId: string, action: string, details?: any) {
  try {
    const { error } = await supabase.from("user_interactions").insert({
      session_id: sessionId,
      action,
      details: details ? JSON.stringify(details) : null,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Error tracking interaction:", error)
    // Don't throw error for tracking failures
  }
}

export async function getBudgetAnalytics(): Promise<BudgetAnalytics> {
  try {
    // Get total and completed sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from("budget_sessions")
      .select("id, completed, final_balance")

    if (sessionsError) throw sessionsError

    const totalSessions = sessions?.length || 0
    const completedSessions = sessions?.filter((s) => s.completed).length || 0
    const averageBalance =
      sessions
        ?.filter((s) => s.completed && s.final_balance !== null)
        .reduce((sum, s) => sum + (s.final_balance || 0), 0) / (completedSessions || 1)

    // Get popular policies (mock data for now)
    const popularPolicies: PolicyPopularity[] = [
      { policy_name: "Defense Spending Cuts", support_count: 45, total_count: 100, popularity_percentage: 45 },
      { policy_name: "Tax Increases on Wealthy", support_count: 67, total_count: 100, popularity_percentage: 67 },
      { policy_name: "Social Security Reform", support_count: 23, total_count: 100, popularity_percentage: 23 },
      { policy_name: "Healthcare Spending Cuts", support_count: 34, total_count: 100, popularity_percentage: 34 },
    ]

    // Get spending vs revenue focus (mock data for now)
    const spendingVsRevenue = {
      spending_focused: 40,
      revenue_focused: 35,
      balanced: 25,
    }

    return {
      totalSessions,
      completedSessions,
      averageBalance,
      popularPolicies,
      spendingVsRevenue,
    }
  } catch (error) {
    console.error("Error getting budget analytics:", error)
    return {
      totalSessions: 0,
      completedSessions: 0,
      averageBalance: 0,
      popularPolicies: [],
      spendingVsRevenue: { spending_focused: 0, revenue_focused: 0, balanced: 0 },
    }
  }
}

export async function getPolicyPopularity(): Promise<PolicyPopularity[]> {
  // Mock data for now - in a real app, this would query the database
  return [
    { policy_name: "Defense Spending Cuts", support_count: 45, total_count: 100, popularity_percentage: 45 },
    { policy_name: "Tax Increases on Wealthy", support_count: 67, total_count: 100, popularity_percentage: 67 },
    { policy_name: "Social Security Reform", support_count: 23, total_count: 100, popularity_percentage: 23 },
    { policy_name: "Healthcare Spending Cuts", support_count: 34, total_count: 100, popularity_percentage: 34 },
    { policy_name: "Infrastructure Investment", support_count: 78, total_count: 100, popularity_percentage: 78 },
  ]
}
