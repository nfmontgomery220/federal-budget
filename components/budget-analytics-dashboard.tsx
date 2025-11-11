"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, TrendingUp, Target, Clock, MapPin, Lightbulb, AlertCircle } from "lucide-react"

// Mock data - in a real app, this would come from your database
const mockAnalytics = {
  totalSessions: 15847,
  completedBudgets: 8923,
  averageDeficitReduction: 67.3,
  popularChoices: [
    { name: "Defense Spending Cuts", percentage: 78, change: -156 },
    { name: "Corporate Tax Increase", percentage: 71, change: +180 },
    { name: "Carbon Tax Implementation", percentage: 64, change: +120 },
    { name: "Infrastructure Investment", percentage: 59, change: +85 },
    { name: "Medicare Expansion", percentage: 45, change: +95 },
  ],
  regionalPreferences: [
    { region: "Northeast", topChoice: "Infrastructure Investment", percentage: 68 },
    { region: "Southeast", topChoice: "Defense Spending Cuts", percentage: 72 },
    { region: "Midwest", topChoice: "Corporate Tax Increase", percentage: 65 },
    { region: "West", topChoice: "Carbon Tax Implementation", percentage: 71 },
    { region: "Southwest", topChoice: "Defense Spending Cuts", percentage: 69 },
  ],
  timeSeriesData: [
    { date: "2025-01", sessions: 1200, avgReduction: 45.2 },
    { date: "2025-02", sessions: 1850, avgReduction: 52.1 },
    { date: "2025-03", sessions: 2100, avgReduction: 58.7 },
    { date: "2025-04", sessions: 2450, avgReduction: 61.3 },
    { date: "2025-05", sessions: 2890, avgReduction: 64.8 },
    { date: "2025-06", sessions: 3200, avgReduction: 67.3 },
    { date: "2025-07", sessions: 2156, avgReduction: 67.3 },
  ],
  politicalFeasibility: [
    { category: "Defense Cuts", support: 68, opposition: 32, difficulty: "Medium" },
    { category: "Tax Increases", support: 45, opposition: 55, difficulty: "High" },
    { category: "Entitlement Reform", support: 23, opposition: 77, difficulty: "Extreme" },
    { category: "Infrastructure Investment", support: 82, opposition: 18, difficulty: "Low" },
    { category: "Climate Action", support: 58, opposition: 42, difficulty: "Medium" },
  ],
}

export default function BudgetAnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Analytics Dashboard</h1>
        <p className="text-gray-600">Real-time insights from user budget exercises and policy preferences</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalSessions.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Budgets</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.completedBudgets.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                {((mockAnalytics.completedBudgets / mockAnalytics.totalSessions) * 100).toFixed(1)}% completion rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deficit Reduction</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.averageDeficitReduction}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-gray-600 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balanced Budgets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mockAnalytics.completedBudgets * 0.23).toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">23% achieve full balance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="popular">Popular Choices</TabsTrigger>
          <TabsTrigger value="regional">Regional Trends</TabsTrigger>
          <TabsTrigger value="feasibility">Political Feasibility</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Budget Choices</CardTitle>
              <CardDescription>What users are choosing most frequently in their budget exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.popularChoices.map((choice, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{choice.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{choice.percentage}% of users</Badge>
                        <span
                          className={`text-sm font-medium ${choice.change > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {choice.change > 0 ? "+" : ""}${choice.change}B avg
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

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Preferences</CardTitle>
              <CardDescription>How budget preferences vary across different regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mockAnalytics.regionalPreferences.map((region, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Top Choice: <span className="font-medium">{region.topChoice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={region.percentage} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{region.percentage}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feasibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Political Feasibility Analysis</CardTitle>
              <CardDescription>
                Public support levels and implementation difficulty for major policy categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.politicalFeasibility.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">{item.category}</span>
                      <Badge
                        variant="outline"
                        className={
                          item.difficulty === "Low"
                            ? "border-green-300 text-green-700"
                            : item.difficulty === "Medium"
                              ? "border-yellow-300 text-yellow-700"
                              : item.difficulty === "High"
                                ? "border-orange-300 text-orange-700"
                                : "border-red-300 text-red-700"
                        }
                      >
                        {item.difficulty} Difficulty
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Support</div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.support} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-green-600">{item.support}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Opposition</div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.opposition} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-red-600">{item.opposition}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <strong>Defense Spending:</strong> 78% of users reduce defense spending, averaging $156B in cuts. This
                  suggests broad public support for military budget reductions.
                </div>
                <div className="text-sm">
                  <strong>Tax Policy:</strong> Corporate tax increases are popular (71% adoption) while individual tax
                  increases face more resistance.
                </div>
                <div className="text-sm">
                  <strong>Regional Differences:</strong> Western states show strongest support for climate action, while
                  Southern states prefer defense cuts.
                </div>
                <div className="text-sm">
                  <strong>Completion Rate:</strong> 56% completion rate indicates strong user engagement with the budget
                  exercise.
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertCircle className="h-5 w-5" />
                  Policy Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Start with Popular Measures:</strong> Begin with defense cuts and corporate tax increases,
                  which have broad support.
                </div>
                <div className="text-sm">
                  <strong>Regional Strategy:</strong> Tailor messaging to regional preferences - emphasize climate
                  benefits in the West, fiscal responsibility in the South.
                </div>
                <div className="text-sm">
                  <strong>Gradual Implementation:</strong> Phase in changes over 3-5 years to build public support and
                  allow economic adjustment.
                </div>
                <div className="text-sm">
                  <strong>Bipartisan Elements:</strong> Infrastructure investment shows broad appeal across regions and
                  political affiliations.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
