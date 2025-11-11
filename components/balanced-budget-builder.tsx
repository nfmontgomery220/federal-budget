"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Shield,
  Building,
  Heart,
  Zap,
  AlertTriangle,
  Target,
} from "lucide-react"

interface BudgetItem {
  id: string
  name: string
  category: "spending" | "revenue"
  subcategory: string
  baseline: number
  current: number
  min: number
  max: number
  description: string
  icon: any
  politicalDifficulty: "Low" | "Medium" | "High" | "Extreme"
  economicImpact: "Positive" | "Neutral" | "Negative"
}

const initialBudgetItems: BudgetItem[] = [
  // Spending Categories
  {
    id: "defense",
    name: "Defense Spending",
    category: "spending",
    subcategory: "Discretionary",
    baseline: 816,
    current: 816,
    min: 400,
    max: 1000,
    description: "Military personnel, operations, procurement, and R&D",
    icon: Shield,
    politicalDifficulty: "High",
    economicImpact: "Neutral",
  },
  {
    id: "social-security",
    name: "Social Security",
    category: "spending",
    subcategory: "Mandatory",
    baseline: 1347,
    current: 1347,
    min: 1000,
    max: 1500,
    description: "Retirement, disability, and survivor benefits",
    icon: Users,
    politicalDifficulty: "Extreme",
    economicImpact: "Positive",
  },
  {
    id: "medicare",
    name: "Medicare",
    category: "spending",
    subcategory: "Mandatory",
    baseline: 1019,
    current: 1019,
    min: 800,
    max: 1200,
    description: "Healthcare for seniors and disabled",
    icon: Heart,
    politicalDifficulty: "Extreme",
    economicImpact: "Positive",
  },
  {
    id: "medicaid",
    name: "Medicaid",
    category: "spending",
    subcategory: "Mandatory",
    baseline: 616,
    current: 616,
    min: 400,
    max: 800,
    description: "Healthcare for low-income individuals and families",
    icon: Heart,
    politicalDifficulty: "High",
    economicImpact: "Positive",
  },
  {
    id: "interest",
    name: "Interest on Debt",
    category: "spending",
    subcategory: "Mandatory",
    baseline: 640,
    current: 640,
    min: 640,
    max: 640,
    description: "Interest payments on federal debt (cannot be changed)",
    icon: DollarSign,
    politicalDifficulty: "Extreme",
    economicImpact: "Negative",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    category: "spending",
    subcategory: "Discretionary",
    baseline: 180,
    current: 180,
    min: 50,
    max: 400,
    description: "Transportation, broadband, water systems, energy grid",
    icon: Building,
    politicalDifficulty: "Low",
    economicImpact: "Positive",
  },
  {
    id: "education",
    name: "Education",
    category: "spending",
    subcategory: "Discretionary",
    baseline: 80,
    current: 80,
    min: 40,
    max: 200,
    description: "K-12, higher education, and job training programs",
    icon: Users,
    politicalDifficulty: "Medium",
    economicImpact: "Positive",
  },
  {
    id: "energy-climate",
    name: "Energy & Climate",
    category: "spending",
    subcategory: "Discretionary",
    baseline: 120,
    current: 120,
    min: 50,
    max: 300,
    description: "Clean energy, climate adaptation, environmental protection",
    icon: Zap,
    politicalDifficulty: "High",
    economicImpact: "Positive",
  },

  // Revenue Categories
  {
    id: "income-tax",
    name: "Individual Income Tax",
    category: "revenue",
    subcategory: "Income",
    baseline: 2044,
    current: 2044,
    min: 1500,
    max: 3000,
    description: "Personal income tax from individuals",
    icon: DollarSign,
    politicalDifficulty: "High",
    economicImpact: "Negative",
  },
  {
    id: "payroll-tax",
    name: "Payroll Tax",
    category: "revenue",
    subcategory: "Payroll",
    baseline: 1484,
    current: 1484,
    min: 1200,
    max: 2000,
    description: "Social Security and Medicare taxes",
    icon: Users,
    politicalDifficulty: "High",
    economicImpact: "Negative",
  },
  {
    id: "corporate-tax",
    name: "Corporate Income Tax",
    category: "revenue",
    subcategory: "Corporate",
    baseline: 420,
    current: 420,
    min: 200,
    max: 800,
    description: "Tax on corporate profits",
    icon: Building,
    politicalDifficulty: "Medium",
    economicImpact: "Negative",
  },
  {
    id: "estate-tax",
    name: "Estate & Gift Tax",
    category: "revenue",
    subcategory: "Wealth",
    baseline: 33,
    current: 33,
    min: 20,
    max: 100,
    description: "Tax on large inheritances and gifts",
    icon: DollarSign,
    politicalDifficulty: "High",
    economicImpact: "Neutral",
  },
  {
    id: "carbon-tax",
    name: "Carbon Tax",
    category: "revenue",
    subcategory: "Environmental",
    baseline: 0,
    current: 0,
    min: 0,
    max: 300,
    description: "Tax on carbon emissions",
    icon: Zap,
    politicalDifficulty: "Extreme",
    economicImpact: "Positive",
  },
  {
    id: "financial-transaction-tax",
    name: "Financial Transaction Tax",
    category: "revenue",
    subcategory: "Financial",
    baseline: 0,
    current: 0,
    min: 0,
    max: 150,
    description: "Small tax on stock, bond, and derivative trades",
    icon: TrendingUp,
    politicalDifficulty: "High",
    economicImpact: "Neutral",
  },
]

export default function BalancedBudgetBuilder() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems)
  const [showResults, setShowResults] = useState(false)

  const totalSpending = budgetItems
    .filter((item) => item.category === "spending")
    .reduce((sum, item) => sum + item.current, 0)

  const totalRevenue = budgetItems
    .filter((item) => item.category === "revenue")
    .reduce((sum, item) => sum + item.current, 0)

  const deficit = totalSpending - totalRevenue
  const baselineDeficit = 2650 // $2.65 trillion baseline deficit

  const deficitReduction = baselineDeficit - deficit
  const deficitReductionPercent = (deficitReduction / baselineDeficit) * 100

  const updateBudgetItem = (id: string, newValue: number) => {
    setBudgetItems((prev) => prev.map((item) => (item.id === id ? { ...item, current: newValue } : item)))
  }

  const resetToBaseline = () => {
    setBudgetItems((prev) => prev.map((item) => ({ ...item, current: item.baseline })))
    setShowResults(false)
  }

  const getDeficitColor = () => {
    if (deficit <= 0) return "text-green-600"
    if (deficit < 1000) return "text-yellow-600"
    return "text-red-600"
  }

  const getDeficitBadgeColor = () => {
    if (deficit <= 0) return "bg-green-100 text-green-800"
    if (deficit < 1000) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const spendingItems = budgetItems.filter((item) => item.category === "spending")
  const revenueItems = budgetItems.filter((item) => item.category === "revenue")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Balanced Budget Builder</h1>
        <p className="text-gray-600">Adjust spending and revenue to balance the 2025 federal budget</p>
      </div>

      {/* Current Status */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${(totalSpending / 1000).toFixed(2)}T</div>
              <div className="text-sm text-gray-600">Total Spending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${(totalRevenue / 1000).toFixed(2)}T</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getDeficitColor()}`}>
                {deficit > 0 ? "-" : "+"}${Math.abs(deficit / 1000).toFixed(2)}T
              </div>
              <div className="text-sm text-gray-600">{deficit > 0 ? "Deficit" : "Surplus"}</div>
            </div>
            <div className="text-center">
              <Badge className={getDeficitBadgeColor()}>
                {deficit <= 0 ? "BALANCED!" : `${deficitReductionPercent.toFixed(1)}% Reduced`}
              </Badge>
            </div>
          </div>

          {deficit > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Deficit Reduction Progress</span>
                <span>{deficitReductionPercent.toFixed(1)}%</span>
              </div>
              <Progress value={Math.max(0, deficitReductionPercent)} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => setShowResults(!showResults)} variant="outline">
              {showResults ? "Hide" : "Show"} Analysis
            </Button>
            <Button onClick={resetToBaseline} variant="outline">
              Reset to Baseline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Analysis */}
      {showResults && (
        <Alert className={deficit <= 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Budget Analysis:</strong>
            {deficit <= 0 ? (
              <span className="text-green-800">
                🎉 Congratulations! You've achieved a balanced budget with a surplus of $
                {Math.abs(deficit).toLocaleString()}B.
              </span>
            ) : (
              <span className="text-yellow-800">
                You've reduced the deficit by ${deficitReduction.toLocaleString()}B (
                {deficitReductionPercent.toFixed(1)}%). ${deficit.toLocaleString()}B more reduction needed to balance
                the budget.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Controls */}
      <Tabs defaultValue="spending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending">Spending ({spendingItems.length} items)</TabsTrigger>
          <TabsTrigger value="revenue">Revenue ({revenueItems.length} items)</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4">
            {spendingItems.map((item) => {
              const Icon = item.icon
              const change = item.current - item.baseline
              const changePercent = (change / item.baseline) * 100

              return (
                <Card key={item.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription className="text-sm">{item.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${item.current.toLocaleString()}B</div>
                        {change !== 0 && (
                          <div
                            className={`text-sm flex items-center gap-1 ${
                              change > 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {change > 0 ? "+" : ""}${change.toLocaleString()}B ({changePercent > 0 ? "+" : ""}
                            {changePercent.toFixed(1)}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Slider
                        value={[item.current]}
                        onValueChange={(value) => updateBudgetItem(item.id, value[0])}
                        min={item.min}
                        max={item.max}
                        step={10}
                        className="w-full"
                        disabled={item.id === "interest"}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${item.min.toLocaleString()}B</span>
                        <span>Baseline: ${item.baseline.toLocaleString()}B</span>
                        <span>${item.max.toLocaleString()}B</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.subcategory}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.politicalDifficulty === "Low"
                              ? "border-green-300 text-green-700"
                              : item.politicalDifficulty === "Medium"
                                ? "border-yellow-300 text-yellow-700"
                                : item.politicalDifficulty === "High"
                                  ? "border-orange-300 text-orange-700"
                                  : "border-red-300 text-red-700"
                          }`}
                        >
                          {item.politicalDifficulty} Political Risk
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.economicImpact === "Positive"
                              ? "border-green-300 text-green-700"
                              : item.economicImpact === "Neutral"
                                ? "border-gray-300 text-gray-700"
                                : "border-red-300 text-red-700"
                          }`}
                        >
                          {item.economicImpact} Economic Impact
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4">
            {revenueItems.map((item) => {
              const Icon = item.icon
              const change = item.current - item.baseline
              const changePercent = item.baseline > 0 ? (change / item.baseline) * 100 : 0

              return (
                <Card key={item.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription className="text-sm">{item.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${item.current.toLocaleString()}B</div>
                        {change !== 0 && (
                          <div
                            className={`text-sm flex items-center gap-1 ${
                              change > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {change > 0 ? "+" : ""}${change.toLocaleString()}B
                            {item.baseline > 0 && ` (${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%)`}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Slider
                        value={[item.current]}
                        onValueChange={(value) => updateBudgetItem(item.id, value[0])}
                        min={item.min}
                        max={item.max}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${item.min.toLocaleString()}B</span>
                        <span>Baseline: ${item.baseline.toLocaleString()}B</span>
                        <span>${item.max.toLocaleString()}B</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.subcategory}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.politicalDifficulty === "Low"
                              ? "border-green-300 text-green-700"
                              : item.politicalDifficulty === "Medium"
                                ? "border-yellow-300 text-yellow-700"
                                : item.politicalDifficulty === "High"
                                  ? "border-orange-300 text-orange-700"
                                  : "border-red-300 text-red-700"
                          }`}
                        >
                          {item.politicalDifficulty} Political Risk
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.economicImpact === "Positive"
                              ? "border-green-300 text-green-700"
                              : item.economicImpact === "Neutral"
                                ? "border-gray-300 text-gray-700"
                                : "border-red-300 text-red-700"
                          }`}
                        >
                          {item.economicImpact} Economic Impact
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
