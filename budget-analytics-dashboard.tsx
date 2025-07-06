"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, TrendingUp, BarChart3, Clock, Target } from "lucide-react"
import { getBudgetAnalytics, getPolicyPopularity } from "@/lib/budget-analytics"
import { formatBillions, formatPercent, formatDate } from "@/utils/format-helpers"
import type { BudgetSession, BudgetConfig, PolicyChoice, UserFeedback } from "@/lib/supabase"

interface BudgetAnalyticsDashboardProps {
  onBack: () => void
}

export default function BudgetAnalyticsDashboard({ onBack }: BudgetAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<{
    sessions: BudgetSession[]
    configs: BudgetConfig[]
    choices: PolicyChoice[]
    feedback: UserFeedback[]
  }>({
    sessions: [],
    configs: [],
    choices: [],
    feedback: [],
  })
  const [policyPopularity, setPolicyPopularity] = useState<Record<string, { count: number; avgAmount: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [analyticsData, popularityData] = await Promise.all([getBudgetAnalytics(), getPolicyPopularity()])
        setAnalytics(analyticsData)
        setPolicyPopularity(popularityData)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const { sessions, configs, feedback } = analytics

  // Calculate key metrics
  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s) => s.completed_at).length
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
  const balancedBudgets = configs.filter((c) => c.final_balance >= 0).length
  const balanceRate = configs.length > 0 ? (balancedBudgets / configs.length) * 100 : 0

  // Average session duration
  const completedSessionsWithDuration = sessions.filter((s) => s.duration_seconds && s.duration_seconds > 0)
  const avgDuration =
    completedSessionsWithDuration.length > 0
      ? completedSessionsWithDuration.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) /
        completedSessionsWithDuration.length
      : 0

  // Most popular policies
  const sortedPolicies = Object.entries(policyPopularity)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)

  // Political affiliation breakdown
  const politicalBreakdown = feedback.reduce(
    (acc, f) => {
      if (f.political_affiliation) {
        acc[f.political_affiliation] = (acc[f.political_affiliation] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Difficulty ratings
  const difficultyRatings = feedback.filter((f) => f.difficulty_rating).map((f) => f.difficulty_rating!)
  const avgDifficulty =
    difficultyRatings.length > 0
      ? difficultyRatings.reduce((sum, rating) => sum + rating, 0) / difficultyRatings.length
      : 0

  // Support rate
  const supportResponses = feedback.filter((f) => f.would_support_plan !== null)
  const supportRate =
    supportResponses.length > 0
      ? (supportResponses.filter((f) => f.would_support_plan).length / supportResponses.length) * 100
      : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {completedSessions} completed ({formatPercent(completionRate)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanced Budgets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balancedBudgets}</div>
            <p className="text-xs text-muted-foreground">{formatPercent(balanceRate)}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgDuration / 60)}m</div>
            <p className="text-xs text-muted-foreground">{Math.round(avgDuration)} seconds average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(supportRate)}%</div>
            <p className="text-xs text-muted-foreground">Would support their plan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policies">Popular Policies</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Most Popular Policy Choices
              </CardTitle>
              <CardDescription>Policies chosen most frequently by users, with average amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedPolicies.map(([policy, stats]) => (
                  <div key={policy} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium capitalize">{policy.replace(/-/g, " ").replace(/_/g, " ")}</div>
                      <div className="text-sm text-muted-foreground">
                        Used {stats.count} times • Avg: {formatBillions(stats.avgAmount)}
                      </div>
                    </div>
                    <div className="w-24">
                      <Progress value={(stats.count / sortedPolicies[0][1].count) * 100} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Political Affiliation</CardTitle>
                <CardDescription>Distribution of user political leanings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(politicalBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([affiliation, count]) => (
                      <div key={affiliation} className="flex items-center justify-between">
                        <span className="capitalize">{affiliation.replace(/-/g, " ")}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Rating</CardTitle>
                <CardDescription>How challenging users found the exercise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{avgDifficulty.toFixed(1)}/5</div>
                  <div className="text-sm text-muted-foreground">Average difficulty rating</div>
                  <Progress value={(avgDifficulty / 5) * 100} className="mt-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Comments</CardTitle>
              <CardDescription>Latest feedback from budget exercise participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback
                  .filter((f) => f.comments && f.comments.trim().length > 0)
                  .slice(0, 10)
                  .map((f, index) => (
                    <div key={f.id || index} className="border-l-2 border-blue-200 pl-4">
                      <div className="text-sm">{f.comments}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {f.political_affiliation && (
                          <span className="capitalize">{f.political_affiliation.replace(/-/g, " ")} • </span>
                        )}
                        {formatDate(f.created_at)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Budget Sessions</CardTitle>
              <CardDescription>Latest user sessions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configs.slice(0, 20).map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{config.scenario_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(config.created_at)} • FY{config.fiscal_year}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${config.final_balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {config.final_balance >= 0 ? "+" : ""}
                        {formatBillions(config.final_balance)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {config.final_balance >= 0 ? "Surplus" : "Deficit"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
