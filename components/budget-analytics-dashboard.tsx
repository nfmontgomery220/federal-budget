"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Target, Clock, Lightbulb, Download, Database } from "lucide-react"
import { getBudgetAnalytics, exportBudgetSessionData, type BudgetAnalytics } from "@/lib/budget-analytics"

export default function BudgetAnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBudgetAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportBudgetSessionData()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Analytics Dashboard</h1>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return <div>No data available</div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights from user budget exercises</p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} className="gap-2">
          {isExporting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export Raw Data (CSV)
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalSessions.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Database className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-gray-600">Live Database</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Budgets</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.completedSessions.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                {analytics.totalSessions > 0
                  ? ((analytics.completedSessions / analytics.totalSessions) * 100).toFixed(1)
                  : 0}
                % completion rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Budget Balance</p>
                <p
                  className={`text-2xl font-bold ${analytics.averageBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {analytics.averageBalance > 0 ? "+" : ""}${analytics.averageBalance}B
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Average Outcome</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balanced Budgets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.spendingVsRevenue.balanced.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Achieved Surplus</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="popular">Popular Choices</TabsTrigger>
          <TabsTrigger value="approach">Budget Approach</TabsTrigger>
          <TabsTrigger value="partisan">Partisan Analysis</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Budget Choices</CardTitle>
              <CardDescription>Policies chosen by the most users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularPolicies.map((choice, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{choice.policy_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{choice.popularity_percentage}% Support</Badge>
                      </div>
                    </div>
                    <Progress value={choice.popularity_percentage} className="h-2" />
                  </div>
                ))}
                {analytics.popularPolicies.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Not enough data yet to determine popular choices.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approach" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How Users Balance the Budget</CardTitle>
              <CardDescription>Preference for spending cuts vs revenue increases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Spending Cut Focused</span>
                    <span>{analytics.spendingVsRevenue.spending_focused} users</span>
                  </div>
                  <Progress
                    value={(analytics.spendingVsRevenue.spending_focused / (analytics.completedSessions || 1)) * 100}
                    className="h-4 bg-red-100 [&>div]:bg-red-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Revenue Increase Focused</span>
                    <span>{analytics.spendingVsRevenue.revenue_focused} users</span>
                  </div>
                  <Progress
                    value={(analytics.spendingVsRevenue.revenue_focused / (analytics.completedSessions || 1)) * 100}
                    className="h-4 bg-green-100 [&>div]:bg-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Balanced Approach</span>
                    <span>{analytics.spendingVsRevenue.balanced} users</span>
                  </div>
                  <Progress
                    value={(analytics.spendingVsRevenue.balanced / (analytics.completedSessions || 1)) * 100}
                    className="h-4 bg-blue-100 [&>div]:bg-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partisan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partisan Breakdown</CardTitle>
              <CardDescription>Average outcomes by political affiliation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Participation by Party</h4>
                  <div className="space-y-3">
                    {["Progressive", "Liberal", "Moderate", "Conservative"].map((party) => {
                      const count =
                        (analytics.partisanBreakdown?.[
                          party.toLowerCase() as keyof typeof analytics.partisanBreakdown
                        ] as number) || 0
                      const total =
                        (analytics.partisanBreakdown?.progressive || 0) +
                          (analytics.partisanBreakdown?.liberal || 0) +
                          (analytics.partisanBreakdown?.moderate || 0) +
                          (analytics.partisanBreakdown?.conservative || 0) || 1

                      return (
                        <div key={party}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{party}</span>
                            <span>{count} users</span>
                          </div>
                          <Progress value={(count / total) * 100} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Average Deficit by Party</h4>
                  <div className="space-y-3">
                    {["Progressive", "Liberal", "Moderate", "Conservative"].map((party) => {
                      const deficit = analytics.partisanBreakdown?.avg_deficit_by_party?.[party.toLowerCase()] || 0
                      const isSurplus = deficit >= 0
                      return (
                        <div key={party} className="flex justify-between items-center border-b pb-2">
                          <span>{party}</span>
                          <span className={`font-bold ${isSurplus ? "text-green-600" : "text-red-600"}`}>
                            {isSurplus ? "+" : ""}${deficit}B
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Consensus Areas:</strong> Analyze the "Popular Choices" tab to see which policies have &gt;50%
                  support. These represent bipartisan opportunities.
                </div>
                <div className="text-sm">
                  <strong>Deficit Gap:</strong> Compare the "Average Budget Balance" to the current deficit (-$1.6T). If
                  users avg -$500B, it shows the public is willing to close 2/3 of the gap.
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Download className="h-5 w-5" />
                  Data Mining
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Export Analysis:</strong> Use the "Export Raw Data" button to download the full CSV dataset.
                </div>
                <div className="text-sm">
                  <strong>Recommended Tools:</strong> Import the CSV into Excel, Python (pandas), or Tableau to run
                  cluster analysis and find user archetypes.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
