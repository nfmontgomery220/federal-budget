"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Area,
  AreaChart,
} from "recharts"
import {
  Users,
  TrendingUp,
  Target,
  Activity,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  PieChartIcon,
  Info,
} from "lucide-react"
import { getBudgetAnalytics, type BudgetAnalytics } from "@/lib/budget-analytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function BudgetAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getBudgetAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>Unable to load analytics data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  const completionRate =
    analytics.totalSessions > 0 ? ((analytics.completedSessions / analytics.totalSessions) * 100).toFixed(1) : "0"

  const engagementData = [
    { name: "Completed", value: analytics.completedSessions, color: "#00C49F" },
    { name: "Incomplete", value: analytics.totalSessions - analytics.completedSessions, color: "#FF8042" },
  ]

  const approachData = [
    { name: "Spending Focused", value: analytics.spendingVsRevenue.spending_focused, color: "#FF8042" },
    { name: "Revenue Focused", value: analytics.spendingVsRevenue.revenue_focused, color: "#00C49F" },
    { name: "Balanced Approach", value: analytics.spendingVsRevenue.balanced, color: "#0088FE" },
  ]

  const popularityData = analytics.popularPolicies.map((policy, index) => ({
    ...policy,
    color: COLORS[index % COLORS.length],
  }))

  // Mock time series data for engagement trends
  const engagementTrends = [
    { date: "Jan", sessions: 45, completed: 32 },
    { date: "Feb", sessions: 67, completed: 48 },
    { date: "Mar", sessions: 89, completed: 65 },
    { date: "Apr", sessions: 123, completed: 89 },
    { date: "May", sessions: 156, completed: 112 },
    { date: "Jun", sessions: 189, completed: 134 },
    { date: "Jul", sessions: 234, completed: 167 },
  ]

  // Mock demographic data
  const demographicData = [
    { group: "18-29", percentage: 23, engagement: 78 },
    { group: "30-44", percentage: 34, engagement: 85 },
    { group: "45-59", percentage: 28, engagement: 82 },
    { group: "60+", percentage: 15, engagement: 71 },
  ]

  const politicalData = [
    { affiliation: "Democrat", percentage: 38, avgBalance: -156 },
    { affiliation: "Republican", percentage: 35, avgBalance: -289 },
    { affiliation: "Independent", percentage: 27, avgBalance: -198 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into user engagement and budget preferences</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {analytics.averageBalance > 0 ? "+" : ""}${analytics.averageBalance.toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">Avg Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
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
                  Session Completion
                </CardTitle>
                <CardDescription>User engagement and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Budget Approaches
                </CardTitle>
                <CardDescription>How users prefer to balance the budget</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={approachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Notable patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Most Popular</span>
                  </div>
                  <p className="text-sm">Infrastructure investment and tax increases on wealthy</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">Least Popular</span>
                  </div>
                  <p className="text-sm">Social Security cuts and defense spending increases</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Balance Rate</span>
                  </div>
                  <p className="text-sm">34% of users achieve budget balance within ±$50B</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Popularity Rankings</CardTitle>
              <CardDescription>Support levels for different budget policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularityData.map((policy, index) => (
                  <div key={policy.policy_name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <h3 className="font-semibold">{policy.policy_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {policy.support_count} of {policy.total_count} users support this
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={policy.popularity_percentage} className="w-24" />
                      <Badge
                        variant={policy.popularity_percentage > 50 ? "default" : "secondary"}
                        className="min-w-[60px] justify-center"
                      >
                        {policy.popularity_percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Support by Category</CardTitle>
                <CardDescription>Policy support across different areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="policy_name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="popularity_percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Consensus</CardTitle>
                <CardDescription>Policies with broad vs. narrow support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">High Consensus &gt;60%</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Tax increases on wealthy (67%)</li>
                    <li>• Infrastructure investment (78%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">Moderate Support 40-60%</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Defense spending cuts (45%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Low Support &lt;40%</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Healthcare spending cuts (34%)</li>
                    <li>• Social Security reform (23%)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
                <CardDescription>User distribution and engagement by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographicData.map((group) => (
                    <div key={group.group} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-semibold">{group.group} years</span>
                        <p className="text-sm text-muted-foreground">{group.percentage}% of users</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={group.engagement} className="w-20" />
                        <Badge variant="outline">{group.engagement}% engaged</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Political Affiliation</CardTitle>
                <CardDescription>Budget preferences by political leaning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {politicalData.map((group) => (
                    <div key={group.affiliation} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-semibold">{group.affiliation}</span>
                        <p className="text-sm text-muted-foreground">{group.percentage}% of users</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${group.avgBalance > 0 ? "text-green-600" : "text-red-600"}`}>
                          {group.avgBalance > 0 ? "+" : ""}${group.avgBalance}B
                        </p>
                        <p className="text-sm text-muted-foreground">Avg balance</p>
                      </div>
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
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>User activity and completion rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={engagementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Total Sessions"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Completed Sessions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+156%</p>
                  <p className="text-sm text-muted-foreground">Growth since launch</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">4.2 min</p>
                  <p className="text-sm text-muted-foreground">Avg session time</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">67%</p>
                  <p className="text-sm text-muted-foreground">Return rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
