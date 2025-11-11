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

// Mock functions for the analytics system
export async function createBudgetSession(): Promise<string> {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function saveBudgetConfig(sessionId: string, category: string, value: number): Promise<void> {
  // Mock implementation
  console.log(`Saving config for session ${sessionId}: ${category} = ${value}`)
}

export async function completeSession(
  sessionId: string,
  approach: string,
  balance: number,
  spending: number,
  revenue: number,
): Promise<void> {
  // Mock implementation
  console.log(`Completing session ${sessionId}: ${approach}, balance: ${balance}`)
}

export async function trackInteraction(
  sessionId: string,
  action: string,
  category?: string,
  value?: string,
): Promise<void> {
  // Mock implementation
  console.log(`Tracking interaction for session ${sessionId}: ${action}`)
}

export async function saveUserFeedback(sessionId: string, feedback: UserFeedback): Promise<void> {
  // Mock implementation
  console.log(`Saving feedback for session ${sessionId}:`, feedback)
}

export async function getBudgetAnalytics(): Promise<BudgetAnalytics> {
  // Mock data
  return {
    totalSessions: 15847,
    completedSessions: 8923,
    averageBalance: -234.5,
    spendingVsRevenue: {
      spending_focused: 45,
      revenue_focused: 35,
      balanced: 20,
    },
    popularPolicies: [
      {
        policy_name: "Defense Spending Cuts",
        support_count: 6960,
        total_count: 8923,
        popularity_percentage: 78,
      },
      {
        policy_name: "Corporate Tax Increase",
        support_count: 6335,
        total_count: 8923,
        popularity_percentage: 71,
      },
      {
        policy_name: "Carbon Tax Implementation",
        support_count: 5711,
        total_count: 8923,
        popularity_percentage: 64,
      },
      {
        policy_name: "Infrastructure Investment",
        support_count: 5264,
        total_count: 8923,
        popularity_percentage: 59,
      },
      {
        policy_name: "Medicare Expansion",
        support_count: 4015,
        total_count: 8923,
        popularity_percentage: 45,
      },
    ],
  }
}
