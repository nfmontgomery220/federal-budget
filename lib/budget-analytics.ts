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
  partisanBreakdown?: {
    conservative: number
    moderate: number
    liberal: number
    progressive: number
    avg_deficit_by_party: Record<string, number>
  }
}

export interface UserFeedback {
  politicalAffiliation?: string
  incomeBracket?: string
  difficultyRating?: number
  comments?: string
  wouldSupportPlan?: boolean
}

// Client-side functions now call API endpoints instead of direct Supabase access

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
    const response = await fetch("/api/save-budget-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, category, value }),
    })

    if (!response.ok) throw new Error("Failed to save budget config")
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
    const response = await fetch("/api/complete-budget-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, scenarioName, balance, spending, revenue }),
    })

    if (!response.ok) throw new Error("Failed to complete budget session")
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
    const response = await fetch("/api/track-interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action, category, value }),
    })

    if (!response.ok) throw new Error("Failed to track interaction")
  } catch (error) {
    console.error(`Failed to track interaction for session ${sessionId}:`, error)
  }
}

export async function saveUserFeedback(sessionId: string, feedback: UserFeedback): Promise<void> {
  try {
    const response = await fetch("/api/save-user-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, feedback }),
    })

    if (!response.ok) throw new Error("Failed to save user feedback")
  } catch (error) {
    console.error(`Failed to save feedback for session ${sessionId}:`, error)
  }
}

export async function exportBudgetSessionData(): Promise<void> {
  try {
    const response = await fetch("/api/export-budget-data")
    if (!response.ok) throw new Error("Export failed")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `budget-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("Failed to export data:", error)
    throw error
  }
}

export async function getBudgetAnalytics(): Promise<BudgetAnalytics> {
  try {
    const response = await fetch("/api/budget-analytics")
    if (!response.ok) throw new Error("Failed to fetch analytics")

    const data = await response.json()
    return data
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
      partisanBreakdown: {
        conservative: 0,
        moderate: 0,
        liberal: 0,
        progressive: 0,
        avg_deficit_by_party: {},
      },
    }
  }
}
