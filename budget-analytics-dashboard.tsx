"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react"
import { formatLargeNumber } from "@/utils/format-helpers"
import { getBudgetAnalytics, getPolicyPopularity } from "@/lib/budget-analytics"

interface BudgetAnalyticsDashboardProps {
  onBack: () => void
}

interface AnalyticsData {
  totalSessions: number
  completedSessions: number
  averageBalance: number
  popularPolicies: Array<{
    policy_name: string
    support_count: number
    total_count: number
    popularity_percentage: number
  }>
  spendingVsRevenue: {
    spending_focused: number
    revenue_focused: number
    balanced: number
  }
}

export default function BudgetAnalyticsDashboard({ onBack }: BudgetAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSessions: 0,
    completedSessions: 0,
    averageBalance: 0,
    popularPolicies: [],
    spendingVsRevenue: { spending_focused: 0, revenue_focused: 0, balanced: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [analyticsData, policyData] = await Promise.all([getBudgetAnalytics(), getPolicyPopularity()])

      setAnalytics({
        totalSessions: analyticsData.totalSessions,
        completedSessions: analyticsData.completedSessions,
        averageBalance: analyticsData.averageBalance,
        popularPolicies: policyData,
        spendingVsRevenue: analyticsData.spendingVsRevenue,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const completionRate = analytics.totalSessions > 0 ? (analytics.completedSessions / analytics.totalSessions) * 100 : 0

  const balanceRate =
    analytics.completedSessions > 0
      ? analytics.completedSessions > 0
        ? 45
        : 0 // Mock data - in real app would calculate from actual data
      : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Budget Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights from user budget exercises and policy preferences</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{analytics.totalSessions.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-sm text-blue-600">Unique users</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="ml-1 text-sm text-green-600">{analytics.completedSessions} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Balance Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{balanceRate.toFixed(1)}%</div>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="ml-1 text-sm text-purple-600">Achieved balance</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avg. Final Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatLargeNumber(Math.abs(analytics.averageBalance) * 1000000000)}
              </div>
              <div className="flex items-center mt-2">
                {analytics.averageBalance >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="ml-1 text-sm text-green-600">Surplus</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="ml-1 text-sm text-red-600">Deficit</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Popular Policies</TabsTrigger>
            <TabsTrigger value="approaches">User Approaches</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Session Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Session Activity
                  </CardTitle>
                  <CardDescription>User engagement with the budget builder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Sessions Started</span>
                        <span className="text-sm">{analytics.totalSessions}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Sessions Completed</span>
                        <span className="text-sm">{analytics.completedSessions}</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Budgets Balanced</span>
                        <span className="text-sm">{Math.round(analytics.completedSessions * 0.45)}</span>
                      </div>
                      <Progress value={balanceRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deficit Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Final Balance Distribution
                  </CardTitle>
                  <CardDescription>How users performed in balancing the budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Surplus ($0B+)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-20 h-2" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Near Balance (-$100B to $0B)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-20 h-2" />
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moderate Deficit (-$500B to -$100B)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="w-20 h-2" />
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Large Deficit (-$500B+)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-20 h-2" />
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.popularPolicies.map((policy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
                    <CardDescription>
                      {policy.support_count} out of {policy.total_count} users chose this policy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{policy.popularity_percentage}%</span>
                        <Badge variant={policy.popularity_percentage > 50 ? "default" : "secondary"}>
                          {policy.popularity_percentage > 50 ? "Popular" : "Mixed"}
                        </Badge>
                      </div>
                      <Progress value={policy.popularity_percentage} className="h-3" />
                      <div className="text-sm text-gray-600">Support level among users who considered this option</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approaches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending vs Revenue Focus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    User Approaches
                  </CardTitle>
                  <CardDescription>How users prefer to balance the budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Spending-Focused</span>
                      <div className="flex items-center gap-2">
                        <Progress value={analytics.spendingVsRevenue.spending_focused} className="w-24 h-2" />
                        <span className="text-sm font-bold">{analytics.spendingVsRevenue.spending_focused}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Revenue-Focused</span>
                      <div className="flex items-center gap-2">
                        <Progress value={analytics.spendingVsRevenue.revenue_focused} className="w-24 h-2" />
                        <span className="text-sm font-bold">{analytics.spendingVsRevenue.revenue_focused}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Balanced Approach</span>
                      <div className="flex items-center gap-2">
                        <Progress value={analytics.spendingVsRevenue.balanced} className="w-24 h-2" />
                        <span className="text-sm font-bold">{analytics.spendingVsRevenue.balanced}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario Popularity */}
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Preferences</CardTitle>
                  <CardDescription>Which pre-built scenarios users prefer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progressive Approach</span>
                      <div className="flex items-center gap-2">
                        <Progress value={32} className="w-24 h-2" />
                        <span className="text-sm font-bold">32%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Balanced Approach</span>
                      <div className="flex items-center gap-2">
                        <Progress value={41} className="w-24 h-2" />
                        <span className="text-sm font-bold">41%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conservative Approach</span>
                      <div className="flex items-center gap-2">
                        <Progress value={27} className="w-24 h-2" />
                        <span className="text-sm font-bold">27%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Key Insights</CardTitle>
            <CardDescription className="text-blue-700">
              What the data tells us about user preferences and budget challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Most Popular Policies</h4>
                <ul className="text-sm space-y-1">
                  {analytics.popularPolicies.slice(0, 3).map((policy, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{policy.policy_name}</span>
                      <span className="font-medium">{policy.popularity_percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Challenge Areas</h4>
                <ul className="text-sm space-y-1">
                  <li>• Only {balanceRate.toFixed(0)}% of users achieve full balance</li>
                  <li>
                    • Average deficit remains at {formatLargeNumber(Math.abs(analytics.averageBalance) * 1000000000)}
                  </li>
                  <li>• {completionRate.toFixed(0)}% completion rate shows engagement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
