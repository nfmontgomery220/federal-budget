"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, TrendingUp, Target, BarChart3, PieChart, Activity } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatLargeNumber, formatPercentage } from "@/utils/format-helpers"

interface BudgetAnalyticsDashboardProps {
  onBack?: () => void
}

export default function BudgetAnalyticsDashboard({ onBack }: BudgetAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data - in real app this would come from your database
  const analyticsData = {
    totalSessions: 15847,
    completedBudgets: 3291,
    averageDeficitReduction: 1850,
    popularChoices: [
      { name: "Defense Cuts", percentage: 78, amount: 150 },
      { name: "Corporate Tax Increase", percentage: 72, amount: 200 },
      { name: "Wealth Tax", percentage: 65, amount: 300 },
      { name: "Carbon Tax", percentage: 58, amount: 180 },
      { name: "Medicare Efficiency", percentage: 45, amount: 80 },
    ],
    userDemographics: [
      { age: "18-29", count: 4200, percentage: 26.5 },
      { age: "30-44", count: 5500, percentage: 34.7 },
      { age: "45-59", count: 4100, percentage: 25.9 },
      { age: "60+", count: 2047, percentage: 12.9 },
    ],
    dailyActivity: [
      { date: "2025-01-20", sessions: 1200, completions: 280 },
      { date: "2025-01-21", sessions: 1350, completions: 310 },
      { date: "2025-01-22", sessions: 1100, completions: 250 },
      { date: "2025-01-23", sessions: 1450, completions: 340 },
      { date: "2025-01-24", sessions: 1600, completions: 380 },
      { date: "2025-01-25", sessions: 1750, completions: 420 },
      { date: "2025-01-26", sessions: 1900, completions: 450 },
    ],
    politicalPreferences: [
      { category: "Progressive", count: 5200, color: "#3b82f6" },
      { category: "Moderate", count: 6800, color: "#10b981" },
      { category: "Conservative", count: 3847, color: "#f59e0b" },
    ],
    balancedBudgets: {
      successful: 3291,
      failed: 12556,
      successRate: 20.8,
    },
  }

  const completionRate = (analyticsData.completedBudgets / analyticsData.totalSessions) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              )}
              <h1 className="text-3xl font-bold">Budget Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600">Real-time insights from user budget exercises and policy preferences</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalSessions.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="ml-1 text-sm text-green-600">+12.5% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.completedBudgets.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-sm text-blue-600">{completionRate.toFixed(1)}% completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Deficit Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatLargeNumber(analyticsData.averageDeficitReduction * 1000000000)}
              </div>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="ml-1 text-sm text-purple-600">
                  {formatPercentage(analyticsData.averageDeficitReduction / 2650)} of total deficit
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.balancedBudgets.successRate}%</div>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="ml-1 text-sm text-orange-600">
                  {analyticsData.balancedBudgets.successful} balanced budgets
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="choices">Popular Choices</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily Activity
                  </CardTitle>
                  <CardDescription>Sessions and completions over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sessions: { label: "Sessions", color: "hsl(var(--chart-1))" },
                      completions: { label: "Completions", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <ChartTooltip />
                        <Bar dataKey="sessions" fill="var(--color-sessions)" />
                        <Bar dataKey="completions" fill="var(--color-completions)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Political Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Political Preferences
                  </CardTitle>
                  <CardDescription>User political alignment based on budget choices</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: { label: "Count", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <ChartTooltip
                          content={({ active, payload }) =>
                            active && payload?.[0] ? (
                              <div className="bg-white border p-2 rounded shadow">
                                <p className="font-medium">{payload[0].payload.category}</p>
                                <p className="text-sm">{payload[0].payload.count.toLocaleString()} users</p>
                              </div>
                            ) : null
                          }
                        />
                        <Pie
                          data={analyticsData.politicalPreferences}
                          dataKey="count"
                          nameKey="category"
                          innerRadius={60}
                          outerRadius={100}
                        >
                          {analyticsData.politicalPreferences.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Completion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>User Journey Funnel</CardTitle>
                <CardDescription>How users progress through the budget builder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Started Budget Builder</span>
                    <div className="flex items-center gap-3">
                      <Progress value={100} className="w-32" />
                      <span className="font-medium">{analyticsData.totalSessions.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Made First Adjustment</span>
                    <div className="flex items-center gap-3">
                      <Progress value={75} className="w-32" />
                      <span className="font-medium">
                        {Math.round(analyticsData.totalSessions * 0.75).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tried Both Spending & Revenue</span>
                    <div className="flex items-center gap-3">
                      <Progress value={45} className="w-32" />
                      <span className="font-medium">
                        {Math.round(analyticsData.totalSessions * 0.45).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Budget</span>
                    <div className="flex items-center gap-3">
                      <Progress value={completionRate} className="w-32" />
                      <span className="font-medium">{analyticsData.completedBudgets.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Achieved Balance</span>
                    <div className="flex items-center gap-3">
                      <Progress value={analyticsData.balancedBudgets.successRate} className="w-32" />
                      <span className="font-medium">{analyticsData.balancedBudgets.successful.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="choices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Budget Choices</CardTitle>
                <CardDescription>What users are choosing to balance the budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularChoices.map((choice, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{choice.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{choice.percentage}% of users</Badge>
                          <span className="text-sm text-gray-600">
                            Avg: {formatLargeNumber(choice.amount * 1000000000)}
                          </span>
                        </div>
                      </div>
                      <Progress value={choice.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                  <CardDescription>User age groups using the budget builder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.userDemographics.map((demo, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{demo.age}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{demo.count.toLocaleString()}</span>
                            <Badge variant="outline">{demo.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={demo.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top states using the budget builder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { state: "California", users: 2847, percentage: 18.0 },
                      { state: "Texas", users: 1923, percentage: 12.1 },
                      { state: "New York", users: 1654, percentage: 10.4 },
                      { state: "Florida", users: 1432, percentage: 9.0 },
                      { state: "Illinois", users: 987, percentage: 6.2 },
                    ].map((geo, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{geo.state}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{geo.users.toLocaleString()}</span>
                          <Badge variant="outline">{geo.percentage}%</Badge>
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
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>How engagement has changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sessions: { label: "Sessions", color: "hsl(var(--chart-1))" },
                    completions: { label: "Completions", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <ChartTooltip />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stackId="1"
                        stroke="var(--color-sessions)"
                        fill="var(--color-sessions)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="completions"
                        stackId="2"
                        stroke="var(--color-completions)"
                        fill="var(--color-completions)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
