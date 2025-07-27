import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// This is a mock implementation of Supabase client for the federal budget tool
// In a real application, this would connect to an actual Supabase instance

export interface BudgetSession {
  id: string
  user_agent: string | null
  referrer: string | null
  created_at: string
  completed_at: string | null
  duration_seconds: number | null
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
  political_affiliation: string | null
  income_bracket: string | null
  difficulty_rating: number | null
  comments: string | null
  would_support_plan: boolean | null
  created_at: string
}

export interface UserInteraction {
  id: string
  session_id: string
  action_type: string
  target: string
  value: string | null
  timestamp: string
}

// class SupabaseClient {
//   private tables: {
//     budget_sessions: BudgetSession[]
//     budget_configurations: BudgetConfig[]
//     policy_choices: PolicyChoice[]
//     user_feedback: UserFeedback[]
//     user_interactions: UserInteraction[]
//   }

//   constructor() {
//     this.tables = {
//       budget_sessions: [],
//       budget_configurations: [],
//       policy_choices: [],
//       user_feedback: [],
//       user_interactions: [],
//     }
//   }

//   from(tableName: string) {
//     return {
//       select: (columns = "*") => {
//         return {
//           order: (column: string, { ascending }: { ascending: boolean }) => {
//             return {
//               data: this.tables[tableName as keyof typeof this.tables] || [],
//               error: null,
//             }
//           },
//           data: this.tables[tableName as keyof typeof this.tables] || [],
//           error: null,
//         }
//       },
//       insert: (data: any) => {
//         const id = `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
//         const timestamp = new Date().toISOString()

//         const newItem = {
//           id,
//           created_at: timestamp,
//           ...data,
//         }

//         // @ts-ignore - Dynamic table access
//         this.tables[tableName].push(newItem)

//         return {
//           data: { id },
//           error: null,
//           select: (columns: string) => {
//             return {
//               single: () => {
//                 return {
//                   data: newItem,
//                   error: null,
//                 }
//               },
//             }
//           },
//         }
//       },
//       update: (data: any) => {
//         return {
//           eq: (column: string, value: any) => {
//             return {
//               data: null,
//               error: null,
//             }
//           },
//         }
//       },
//     }
//   }
// }

// export const supabase = new SupabaseClient()
