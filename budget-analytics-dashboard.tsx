"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Activity,
  BarChart3,
  PieChartIcon,
  RefreshCw,
} from "lucide-react"
import { getBudgetAnalytics, type BudgetAnalytics } from "@/lib/budget-analytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const mockUserEngagement = [
  { month: "Jan", sessions: 120, completed: 89 },
  { month: "Feb", sessions: 145, completed: 112 },
  { month: "Mar", sessions: 189, completed: 156 },
  { month: "Apr", sessions: 234, completed: 198 },
  { month: "May", sessions: 267, completed: 223 },
  { month: "Jun", sessions: 298, completed: 251 },
]

const mockPoliticalBreakdown = [
  { name: "Conservative", value: 35, color: "#FF6B6B" },
  { name: "Moderate", value: 42, color: "#4ECDC4" },
  { name: "Liberal", value: 23, color: "#45B7D1" },
]

const mockIncomeBreakdown = [
  { bracket: "Under $50K", count: 234, percentage: 28 },
  { bracket: "$50K-$100K", count: 312, percentage: 37 },
  { bracket: "$100K-$200K", count: 198, percentage: 24 },
  { bracket: "Over $200K", count: 89, percentage: 11 },
]

export default function BudgetAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getBudgetAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
        <Button onClick={loadAnalytics} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  const completionRate = (analytics.completedSessions / analytics.totalSessions) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights from user budget exercises and policy preferences</p>
        </div>
        <Button onClick={loadAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{analytics.totalSessions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{analytics.completedSessions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Completed Budgets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {analytics.averageBalance > 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
              <div className="text-right">
                <p className={`text-2xl font-bold ${analytics.averageBalance > 0 ? "text-green-600" : "text-red-600"}`}>
                  ${Math.abs(analytics.averageBalance).toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">
                  Avg. {analytics.averageBalance > 0 ? "Surplus" : "Deficit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policy Popularity</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Budget Approach Distribution
                </CardTitle>
                <CardDescription>How users approach balancing the budget</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Spending Focused", value: analytics.spendingVsRevenue.spending_focused },
                        { name: "Revenue Focused", value: analytics.spendingVsRevenue.revenue_focused },
                        { name: "Balanced Approach", value: analytics.spendingVsRevenue.balanced },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: "Spending Focused", value: analytics.spendingVsRevenue.spending_focused },
                        { name: "Revenue Focused", value: analytics.spendingVsRevenue.revenue_focused },
                        { name: "Balanced Approach", value: analytics.spendingVsRevenue.balanced },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Engagement Over Time
                </CardTitle>
                <CardDescription>Monthly session and completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockUserEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sessions" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Popularity Rankings</CardTitle>
              <CardDescription>Support levels for different budget policies among users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularPolicies.map((policy, index) => (
                  <div key={policy.policy_name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="font-medium">{policy.policy_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{policy.popularity_percentage}%</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({policy.support_count}/{policy.total_count})
                        </span>
                      </div>
                    </div>
                    <Progress value={policy.popularity_percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Support by Category</CardTitle>
              <CardDescription>Detailed breakdown of policy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.popularPolicies} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="policy_name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, "Support"]} />
                  <Bar dataKey="popularity_percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Political Affiliation</CardTitle>
                <CardDescription>Self-reported political leanings of users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockPoliticalBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPoliticalBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
                <CardDescription>User income brackets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIncomeBreakdown.map((bracket) => (
                    <div key={bracket.bracket} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{bracket.bracket}</span>
                        <div className="text-right">
                          <span className="text-sm font-medium">{bracket.percentage}%</span>
                          <span className="text-xs text-muted-foreground ml-2">({bracket.count} users)</span>
                        </div>
                      </div>
                      <Progress value={bracket.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Balance Trends</CardTitle>
              <CardDescription>How user budget outcomes have changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={[
                    { month: "Jan", avgBalance: -450, sessions: 120 },
                    { month: "Feb", avgBalance: -380, sessions: 145 },
                    { month: "Mar", avgBalance: -320, sessions: 189 },
                    { month: "Apr", avgBalance: -280, sessions: 234 },
                    { month: "May", avgBalance: -235, sessions: 267 },
                    { month: "Jun", avgBalance: -190, sessions: 298 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [name === "avgBalance" ? `$${value}B` : value, name]} />
                  <Line type="monotone" dataKey="avgBalance" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">+15%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate Improvement</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">$260B</p>
                  <p className="text-sm text-muted-foreground">Avg. Deficit Reduction</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">2.3x</p>
                  <p className="text-sm text-muted-foreground">User Growth Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
