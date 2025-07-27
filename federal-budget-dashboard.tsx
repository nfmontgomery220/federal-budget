"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Shield,
  Heart,
  GraduationCap,
  Plane,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react"
import { formatLargeNumber, formatPercentage } from "@/utils/format-helpers"
import { createBudgetSession, trackInteraction } from "@/lib/budget-analytics"

interface FederalBudgetDashboardProps {
  onBack?: () => void
}

interface BudgetCategory {
  name: string
  amount: number
  percentage: number
  change: number
  icon: React.ReactNode
  color: string
}

interface RevenueSource {
  name: string
  amount: number
  percentage: number
  change: number
  icon: React.ReactNode
  color: string
}

export default function FederalBudgetDashboard({ onBack }: FederalBudgetDashboardProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState(2025)
  const [activeTab, setActiveTab] = useState("overview")

  // 2025 post-"One Big Beautiful Bill Act" budget data
  const budgetData = {
    totalSpending: 7200,
    totalRevenue: 4550,
    deficit: 2650,
    gdp: 28000,
    deficitAsPercentOfGDP: 9.5,
    debtToGDP: 106.2,
    interestPayments: 640,
  }

  const spendingCategories: BudgetCategory[] = [
    {
      name: "Social Security",
      amount: 1347,
      percentage: 18.7,
      change: 5.2,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      name: "Medicare",
      amount: 1019,
      percentage: 14.2,
      change: 6.8,
      icon: <Heart className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      name: "Defense",
      amount: 886,
      percentage: 12.3,
      change: 3.1,
      icon: <Shield className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      name: "Interest on Debt",
      amount: 640,
      percentage: 8.9,
      change: 12.4,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      name: "Medicaid",
      amount: 616,
      percentage: 8.6,
      change: 4.7,
      icon: <Heart className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      name: "Veterans Affairs",
      amount: 303,
      percentage: 4.2,
      change: 2.9,
      icon: <Shield className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
    {
      name: "Transportation",
      amount: 105,
      percentage: 1.5,
      change: -2.1,
      icon: <Plane className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      name: "Education",
      amount: 80,
      percentage: 1.1,
      change: -5.3,
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-pink-500",
    },
  ]

  const revenueSources: RevenueSource[] = [
    {
      name: "Individual Income Tax",
      amount: 2044,
      percentage: 44.9,
      change: -8.2,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      name: "Payroll Tax",
      amount: 1484,
      percentage: 32.6,
      change: 2.1,
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      name: "Corporate Income Tax",
      amount: 420,
      percentage: 9.2,
      change: -15.7,
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      name: "Customs Duties",
      amount: 365,
      percentage: 8.0,
      change: 45.2,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      name: "Estate & Gift Tax",
      amount: 25,
      percentage: 0.5,
      change: -12.3,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      name: "Other",
      amount: 212,
      percentage: 4.7,
      change: 1.8,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-gray-500",
    },
  ]

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      const id = await createBudgetSession()
      setSessionId(id)
      await trackInteraction(id, "viewed_budget_dashboard")
    } catch (error) {
      console.error("Error initializing session:", error)
    }
  }

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab)
    if (sessionId) {
      await trackInteraction(sessionId, "changed_dashboard_tab", { tab })
    }
  }

  const getDeficitSeverity = () => {
    if (budgetData.deficitAsPercentOfGDP > 8)
      return { level: "Critical", color: "text-red-600", icon: <AlertTriangle className="h-5 w-5" /> }
    if (budgetData.deficitAsPercentOfGDP > 5)
      return { level: "High", color: "text-orange-600", icon: <AlertTriangle className="h-5 w-5" /> }
    if (budgetData.deficitAsPercentOfGDP > 3)
      return { level: "Moderate", color: "text-yellow-600", icon: <Target className="h-5 w-5" /> }
    return { level: "Low", color: "text-green-600", icon: <CheckCircle className="h-5 w-5" /> }
  }

  const deficitSeverity = getDeficitSeverity()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Federal Budget Dashboard</h1>
          <p className="text-lg text-gray-600">
            Comprehensive overview of the {selectedYear} federal budget in the post-"One Big Beautiful Bill Act" era
          </p>
        </div>

        {/* Crisis Alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Fiscal Crisis:</strong> The current deficit of $2.65T represents {budgetData.deficitAsPercentOfGDP}%
            of GDP, well above sustainable levels. Immediate action is required to prevent a debt crisis.
          </AlertDescription>
        </Alert>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Annual Deficit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatLargeNumber(budgetData.deficit * 1000000000)}
              </div>
              <div className="flex items-center mt-2">
                {deficitSeverity.icon}
                <span className={`ml-1 text-sm ${deficitSeverity.color}`}>{deficitSeverity.level} Risk</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatLargeNumber(budgetData.totalSpending * 1000000000)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-sm text-blue-600">
                  {formatPercentage(budgetData.totalSpending / budgetData.gdp)} of GDP
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatLargeNumber(budgetData.totalRevenue * 1000000000)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="ml-1 text-sm text-red-600">
                  {formatPercentage(budgetData.totalRevenue / budgetData.gdp)} of GDP
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Debt-to-GDP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{budgetData.debtToGDP}%</div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="ml-1 text-sm text-orange-600">Above 90% threshold</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending Breakdown</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deficit Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Balance</CardTitle>
                  <CardDescription>Revenue vs Spending comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Revenue</span>
                        <span className="text-sm text-green-600">
                          {formatLargeNumber(budgetData.totalRevenue * 1000000000)}
                        </span>
                      </div>
                      <Progress value={(budgetData.totalRevenue / budgetData.totalSpending) * 100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Spending</span>
                        <span className="text-sm text-red-600">
                          {formatLargeNumber(budgetData.totalSpending * 1000000000)}
                        </span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Deficit</span>
                        <span className="font-bold text-red-600">
                          {formatLargeNumber(budgetData.deficit * 1000000000)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Historical Context */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Context</CardTitle>
                  <CardDescription>How 2025 compares to previous years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2020 (COVID Peak)</span>
                      <Badge variant="destructive">14.7% of GDP</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2024 (Pre-Bill)</span>
                      <Badge variant="secondary">5.8% of GDP</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">2025 (Current)</span>
                      <Badge variant="destructive">{budgetData.deficitAsPercentOfGDP}% of GDP</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sustainable Level</span>
                      <Badge variant="default">3.0% of GDP</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interest Payments Warning */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Interest Payment Crisis:</strong> Interest on the national debt now costs
                {formatLargeNumber(budgetData.interestPayments * 1000000000)} annually, consuming{" "}
                {formatPercentage(budgetData.interestPayments / budgetData.totalRevenue)} of all federal revenue.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {spendingCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {category.icon}
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{formatLargeNumber(category.amount * 1000000000)}</span>
                        <Badge variant="outline">{category.percentage}% of budget</Badge>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Year-over-year change</span>
                        <span className={category.change > 0 ? "text-red-600" : "text-green-600"}>
                          {category.change > 0 ? "+" : ""}
                          {category.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {revenueSources.map((source, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {source.icon}
                      {source.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{formatLargeNumber(source.amount * 1000000000)}</span>
                        <Badge variant="outline">{source.percentage}% of revenue</Badge>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Year-over-year change</span>
                        <span className={source.change > 0 ? "text-green-600" : "text-red-600"}>
                          {source.change > 0 ? "+" : ""}
                          {source.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Items */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Recommended Actions</CardTitle>
            <CardDescription className="text-blue-700">
              Based on current fiscal conditions, these tools can help explore solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <div className="font-medium">Use Budget Builder</div>
                <div className="text-sm text-gray-600">
                  Interactive tool to balance the budget through spending and revenue changes
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <div className="font-medium">Analyze Revenue Options</div>
                <div className="text-sm text-gray-600">Explore tax policy changes and their revenue potential</div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <div className="font-medium">Review Spending Cuts</div>
                <div className="text-sm text-gray-600">Examine potential reductions across government programs</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
