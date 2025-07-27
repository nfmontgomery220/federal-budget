"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Shield,
  Heart,
  Building2,
  Plane,
  GraduationCap,
  Save,
  Share2,
} from "lucide-react"
import { formatLargeNumber } from "@/utils/format-helpers"
import { createBudgetSession, trackInteraction } from "@/lib/budget-analytics"

interface BalancedBudgetBuilderProps {
  onBack?: () => void
}

interface BudgetItem {
  id: string
  name: string
  category: "spending" | "revenue"
  baseAmount: number
  currentAmount: number
  minAmount: number
  maxAmount: number
  icon: React.ReactNode
  description: string
  politicalDifficulty: "Easy" | "Moderate" | "Hard" | "Very Hard"
  economicImpact: "Low" | "Medium" | "High"
}

export default function BalancedBudgetBuilder({ onBack }: BalancedBudgetBuilderProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [activeTab, setActiveTab] = useState("spending")
  const [totalDeficit, setTotalDeficit] = useState(2650)
  const [isBalanced, setIsBalanced] = useState(false)

  const initialBudgetItems: BudgetItem[] = [
    // Spending Categories
    {
      id: "defense",
      name: "Defense Spending",
      category: "spending",
      baseAmount: 886,
      currentAmount: 886,
      minAmount: 600,
      maxAmount: 886,
      icon: <Shield className="h-5 w-5" />,
      description: "Military personnel, operations, and equipment",
      politicalDifficulty: "Very Hard",
      economicImpact: "High",
    },
    {
      id: "social-security",
      name: "Social Security",
      category: "spending",
      baseAmount: 1347,
      currentAmount: 1347,
      minAmount: 1200,
      maxAmount: 1347,
      icon: <Users className="h-5 w-5" />,
      description: "Retirement and disability benefits",
      politicalDifficulty: "Very Hard",
      economicImpact: "High",
    },
    {
      id: "medicare",
      name: "Medicare",
      category: "spending",
      baseAmount: 1019,
      currentAmount: 1019,
      minAmount: 900,
      maxAmount: 1019,
      icon: <Heart className="h-5 w-5" />,
      description: "Healthcare for seniors and disabled",
      politicalDifficulty: "Very Hard",
      economicImpact: "High",
    },
    {
      id: "medicaid",
      name: "Medicaid",
      category: "spending",
      baseAmount: 616,
      currentAmount: 616,
      minAmount: 500,
      maxAmount: 616,
      icon: <Heart className="h-5 w-5" />,
      description: "Healthcare for low-income individuals",
      politicalDifficulty: "Hard",
      economicImpact: "Medium",
    },
    {
      id: "veterans",
      name: "Veterans Affairs",
      category: "spending",
      baseAmount: 303,
      currentAmount: 303,
      minAmount: 250,
      maxAmount: 303,
      icon: <Shield className="h-5 w-5" />,
      description: "Veterans benefits and healthcare",
      politicalDifficulty: "Very Hard",
      economicImpact: "Medium",
    },
    {
      id: "transportation",
      name: "Transportation",
      category: "spending",
      baseAmount: 105,
      currentAmount: 105,
      minAmount: 50,
      maxAmount: 105,
      icon: <Plane className="h-5 w-5" />,
      description: "Infrastructure and transportation programs",
      politicalDifficulty: "Moderate",
      economicImpact: "Medium",
    },
    {
      id: "education",
      name: "Education",
      category: "spending",
      baseAmount: 80,
      currentAmount: 80,
      minAmount: 40,
      maxAmount: 80,
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Federal education programs",
      politicalDifficulty: "Hard",
      economicImpact: "Medium",
    },
    // Revenue Categories
    {
      id: "income-tax",
      name: "Individual Income Tax",
      category: "revenue",
      baseAmount: 2044,
      currentAmount: 2044,
      minAmount: 2044,
      maxAmount: 3500,
      icon: <Users className="h-5 w-5" />,
      description: "Personal income tax rates and brackets",
      politicalDifficulty: "Hard",
      economicImpact: "High",
    },
    {
      id: "corporate-tax",
      name: "Corporate Income Tax",
      category: "revenue",
      baseAmount: 420,
      currentAmount: 420,
      minAmount: 420,
      maxAmount: 800,
      icon: <Building2 className="h-5 w-5" />,
      description: "Corporate tax rates and policies",
      politicalDifficulty: "Very Hard",
      economicImpact: "High",
    },
    {
      id: "payroll-tax",
      name: "Payroll Tax",
      category: "revenue",
      baseAmount: 1484,
      currentAmount: 1484,
      minAmount: 1484,
      maxAmount: 2000,
      icon: <Building2 className="h-5 w-5" />,
      description: "Social Security and Medicare taxes",
      politicalDifficulty: "Hard",
      economicImpact: "Medium",
    },
    {
      id: "wealth-tax",
      name: "Wealth Tax (New)",
      category: "revenue",
      baseAmount: 0,
      currentAmount: 0,
      minAmount: 0,
      maxAmount: 500,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Tax on net worth above $50M",
      politicalDifficulty: "Very Hard",
      economicImpact: "Medium",
    },
    {
      id: "carbon-tax",
      name: "Carbon Tax (New)",
      category: "revenue",
      baseAmount: 0,
      currentAmount: 0,
      minAmount: 0,
      maxAmount: 300,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Tax on carbon emissions",
      politicalDifficulty: "Very Hard",
      economicImpact: "High",
    },
  ]

  useEffect(() => {
    setBudgetItems(initialBudgetItems)
    initializeSession()
  }, [])

  useEffect(() => {
    calculateDeficit()
  }, [budgetItems])

  const initializeSession = async () => {
    try {
      const id = await createBudgetSession()
      setSessionId(id)
      await trackInteraction(id, "started_budget_builder")
    } catch (error) {
      console.error("Error initializing session:", error)
    }
  }

  const calculateDeficit = () => {
    const totalSpending = budgetItems
      .filter((item) => item.category === "spending")
      .reduce((sum, item) => sum + item.currentAmount, 0)

    const totalRevenue = budgetItems
      .filter((item) => item.category === "revenue")
      .reduce((sum, item) => sum + item.currentAmount, 0)

    const newDeficit = totalSpending - totalRevenue
    setTotalDeficit(newDeficit)
    setIsBalanced(Math.abs(newDeficit) < 50) // Within $50B is considered balanced
  }

  const handleSliderChange = async (itemId: string, value: number[]) => {
    const newAmount = value[0]
    setBudgetItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, currentAmount: newAmount } : item)))

    if (sessionId) {
      await trackInteraction(sessionId, "adjusted_budget_item", {
        itemId,
        newAmount,
        category: budgetItems.find((item) => item.id === itemId)?.category,
      })
    }
  }

  const resetBudget = () => {
    setBudgetItems(initialBudgetItems)
  }

  const saveBudget = async () => {
    if (sessionId) {
      await trackInteraction(sessionId, "saved_budget", {
        totalDeficit,
        isBalanced,
        budgetItems: budgetItems.map((item) => ({
          id: item.id,
          currentAmount: item.currentAmount,
          change: item.currentAmount - item.baseAmount,
        })),
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-orange-100 text-orange-800"
      case "Very Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Low":
        return "bg-blue-100 text-blue-800"
      case "Medium":
        return "bg-purple-100 text-purple-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const spendingItems = budgetItems.filter((item) => item.category === "spending")
  const revenueItems = budgetItems.filter((item) => item.category === "revenue")

  const totalSpending = spendingItems.reduce((sum, item) => sum + item.currentAmount, 0)
  const totalRevenue = revenueItems.reduce((sum, item) => sum + item.currentAmount, 0)

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
              <h1 className="text-3xl font-bold">Budget Builder</h1>
            </div>
            <p className="text-gray-600">Balance the 2025 federal budget by adjusting spending and revenue</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={resetBudget}>
              Reset
            </Button>
            <Button variant="outline" onClick={saveBudget}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Budget Status */}
        <Card className={`border-2 ${isBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isBalanced ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
              Budget Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatLargeNumber(totalSpending * 1000000000)}</div>
                <div className="text-sm text-gray-600">Total Spending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatLargeNumber(totalRevenue * 1000000000)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalDeficit > 0 ? "text-red-600" : "text-green-600"}`}>
                  {totalDeficit > 0 ? "-" : "+"}
                  {formatLargeNumber(Math.abs(totalDeficit) * 1000000000)}
                </div>
                <div className="text-sm text-gray-600">{totalDeficit > 0 ? "Deficit" : "Surplus"}</div>
              </div>
              <div className="text-center">
                <Badge variant={isBalanced ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {isBalanced ? "Balanced!" : "Unbalanced"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {!isBalanced && (
          <Alert className="border-orange-200 bg-orange-50">
            <Target className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Goal:</strong> Reduce the deficit to under $50B. Current deficit:{" "}
              {formatLargeNumber(totalDeficit * 1000000000)}
            </AlertDescription>
          </Alert>
        )}

        {/* Budget Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spending">Spending Cuts</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Increases</TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="space-y-4">
            <div className="grid gap-4">
              {spendingItems.map((item) => {
                const change = item.currentAmount - item.baseAmount
                const changePercent = (change / item.baseAmount) * 100

                return (
                  <Card key={item.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {item.icon}
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(item.politicalDifficulty)} variant="outline">
                            {item.politicalDifficulty}
                          </Badge>
                          <Badge className={getImpactColor(item.economicImpact)} variant="outline">
                            {item.economicImpact} Impact
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatLargeNumber(item.minAmount * 1000000000)} -{" "}
                          {formatLargeNumber(item.maxAmount * 1000000000)}
                        </span>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatLargeNumber(item.currentAmount * 1000000000)}</div>
                          {change !== 0 && (
                            <div
                              className={`text-sm flex items-center gap-1 ${change < 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                              {change > 0 ? "+" : ""}
                              {formatLargeNumber(Math.abs(change) * 1000000000)} ({changePercent.toFixed(1)}%)
                            </div>
                          )}
                        </div>
                      </div>
                      <Slider
                        value={[item.currentAmount]}
                        onValueChange={(value) => handleSliderChange(item.id, value)}
                        min={item.minAmount}
                        max={item.maxAmount}
                        step={5}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4">
              {revenueItems.map((item) => {
                const change = item.currentAmount - item.baseAmount
                const changePercent = item.baseAmount > 0 ? (change / item.baseAmount) * 100 : 0

                return (
                  <Card key={item.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {item.icon}
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(item.politicalDifficulty)} variant="outline">
                            {item.politicalDifficulty}
                          </Badge>
                          <Badge className={getImpactColor(item.economicImpact)} variant="outline">
                            {item.economicImpact} Impact
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatLargeNumber(item.minAmount * 1000000000)} -{" "}
                          {formatLargeNumber(item.maxAmount * 1000000000)}
                        </span>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatLargeNumber(item.currentAmount * 1000000000)}</div>
                          {change !== 0 && (
                            <div
                              className={`text-sm flex items-center gap-1 ${change > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {change > 0 ? "+" : ""}
                              {formatLargeNumber(Math.abs(change) * 1000000000)}
                              {item.baseAmount > 0 && ` (${changePercent.toFixed(1)}%)`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Slider
                        value={[item.currentAmount]}
                        onValueChange={(value) => handleSliderChange(item.id, value)}
                        min={item.minAmount}
                        max={item.maxAmount}
                        step={item.baseAmount > 0 ? 10 : 5}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        {isBalanced && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Congratulations!</strong> You've successfully balanced the federal budget. Your plan reduces the
              deficit to {formatLargeNumber(Math.abs(totalDeficit) * 1000000000)}.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
