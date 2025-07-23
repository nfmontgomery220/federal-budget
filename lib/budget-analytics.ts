import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface BudgetSession {
  id: string
  user_id?: string
  session_data: any
  created_at: string
  completed: boolean
  deficit_closed: boolean
  total_cuts: number
  total_increases: number
  final_deficit: number
}

export interface BudgetConfig {
  id: string
  session_id: string
  fiscal_year: number
  scenario_name: string
  scenario_type: string
  final_balance: number
  achieved_balance: boolean
  total_spending_cuts: number
  total_revenue_increases: number
  spending_cuts: Record<string, number>
  revenue_increases: Record<string, number>
  created_at: string
}

export interface PolicyChoice {
  id: string
  config_id: string
  category: string
  policy_type: string
  amount: number
  created_at: string
}

export interface UserFeedback {
  id: string
  session_id: string
  political_affiliation?: string
  income_bracket?: string
  difficulty_rating?: number
  comments?: string
  would_support_plan?: boolean
  created_at: string
}

// Create a new budget session
/**
 * Create a new budget session.
 * We only insert columns that are guaranteed to exist in the deployed schema
 * (id will be auto-generated and created_at has a default).
 */
export async function createBudgetSession(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("budget_sessions")
      // insert an empty row – defaults handle everything else
      .insert({})
      .select("id")
      .single()

    if (error) {
      console.error("Error creating budget session:", error)
      return null
    }

    return data.id
  } catch (err) {
    console.error("Error creating budget session:", err)
    return null
  }
}

// Save budget configuration
export async function saveBudgetConfig(
  sessionId: string,
  fiscalYear: number,
  scenarioName: string,
  scenarioType: string,
  finalBalance: number,
  totalSpendingCuts: number,
  totalRevenueIncreases: number,
  spendingCuts: Record<string, number>,
  revenueIncreases: Record<string, number>,
): Promise<string | null> {
  try {
    const achievedBalance = finalBalance >= 0

    const { data, error } = await supabase
      .from("budget_configs")
      .insert({
        session_id: sessionId,
        fiscal_year: fiscalYear,
        scenario_name: scenarioName,
        scenario_type: scenarioType,
        final_balance: finalBalance,
        achieved_balance: achievedBalance,
        total_spending_cuts: totalSpendingCuts,
        total_revenue_increases: totalRevenueIncreases,
        spending_cuts: spendingCuts,
        revenue_increases: revenueIncreases,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error saving budget config:", error)
      return null
    }

    // Save individual policy choices for detailed analytics
    const configId = data.id
    const policyChoices: any[] = []

    // Add spending cuts
    Object.entries(spendingCuts).forEach(([policy, amount]) => {
      if (amount > 0) {
        policyChoices.push({
          config_id: configId,
          category: "spending",
          policy_type: policy,
          amount: amount,
        })
      }
    })

    // Add revenue increases
    Object.entries(revenueIncreases).forEach(([policy, amount]) => {
      if (amount > 0) {
        policyChoices.push({
          config_id: configId,
          category: "revenue",
          policy_type: policy,
          amount: amount,
        })
      }
    })

    if (policyChoices.length > 0) {
      const { error: choicesError } = await supabase.from("policy_choices").insert(policyChoices)

      if (choicesError) {
        console.error("Error saving policy choices:", choicesError)
      }
    }

    return configId
  } catch (error) {
    console.error("Error saving budget config:", error)
    return null
  }
}

// Complete a session
export async function completeSession(sessionId: string, completionTime: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("budget_sessions")
      .update({
        completed: true,
        completion_time: completionTime,
      })
      .eq("id", sessionId)

    if (error) {
      console.error("Error completing session:", error)
    }
  } catch (error) {
    console.error("Error completing session:", error)
  }
}

// Save user feedback
export async function saveUserFeedback(
  sessionId: string,
  feedback: {
    politicalAffiliation?: string
    incomeBracket?: string
    difficultyRating?: number
    comments?: string
    wouldSupportPlan?: boolean
  },
): Promise<void> {
  try {
    const { error } = await supabase.from("user_feedback").insert({
      session_id: sessionId,
      political_affiliation: feedback.politicalAffiliation,
      income_bracket: feedback.incomeBracket,
      difficulty_rating: feedback.difficultyRating,
      comments: feedback.comments,
      would_support_plan: feedback.wouldSupportPlan,
    })

    if (error) {
      console.error("Error saving user feedback:", error)
    }
  } catch (error) {
    console.error("Error saving user feedback:", error)
  }
}

// Track user interactions
export async function trackInteraction(
  sessionId: string,
  actionType: string,
  target: string,
  value?: string,
): Promise<void> {
  try {
    const { error } = await supabase.from("user_interactions").insert({
      session_id: sessionId,
      action_type: actionType,
      target: target,
      value: value,
    })

    if (error) {
      console.error("Error tracking interaction:", error)
    }
  } catch (error) {
    console.error("Error tracking interaction:", error)
  }
}

// Get budget analytics data
export async function getBudgetAnalytics(): Promise<{
  sessions: BudgetSession[]
  configs: BudgetConfig[]
  choices: PolicyChoice[]
  feedback: UserFeedback[]
}> {
  try {
    const [sessionsResult, configsResult, choicesResult, feedbackResult] = await Promise.all([
      supabase.from("budget_sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("budget_configs").select("*").order("created_at", { ascending: false }),
      supabase.from("policy_choices").select("*").order("created_at", { ascending: false }),
      supabase.from("user_feedback").select("*").order("created_at", { ascending: false }),
    ])

    return {
      sessions: sessionsResult.data || [],
      configs: configsResult.data || [],
      choices: choicesResult.data || [],
      feedback: feedbackResult.data || [],
    }
  } catch (error) {
    console.error("Error fetching budget analytics:", error)
    return {
      sessions: [],
      configs: [],
      choices: [],
      feedback: [],
    }
  }
}

// Get policy popularity statistics
export async function getPolicyPopularity(): Promise<Record<string, { count: number; avgAmount: number }>> {
  try {
    const { data, error } = await supabase.from("policy_choices").select("policy_type, amount")

    if (error) {
      console.error("Error fetching policy popularity:", error)
      return {}
    }

    const stats: Record<string, { count: number; totalAmount: number; avgAmount: number }> = {}

    data.forEach((choice) => {
      if (!stats[choice.policy_type]) {
        stats[choice.policy_type] = { count: 0, totalAmount: 0, avgAmount: 0 }
      }
      stats[choice.policy_type].count++
      stats[choice.policy_type].totalAmount += choice.amount
    })

    // Calculate averages
    Object.keys(stats).forEach((policy) => {
      stats[policy].avgAmount = stats[policy].totalAmount / stats[policy].count
    })

    return stats
  } catch (error) {
    console.error("Error fetching policy popularity:", error)
    return {}
  }
}
