"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Shield,
  Building2,
  Heart,
  GraduationCap,
} from "lucide-react"
import { formatLargeNumber, formatPercentage } from "@/utils/format-helpers"
import { createBudgetSession, saveBudgetConfig, completeSession, trackInteraction } from "@/lib/budget-analytics"
import { UserFeedbackModal } from "@/components/user-feedback-modal"

interface BalancedBudgetBuilderProps {
  onBack: () => void
}

interface BudgetItem {
  id: string
  name: string
  current: number
  proposed: number
  min: number
  max: number
  icon: React.ReactNode
  description: string
  category: "spending" | "revenue"
  subcategory?: string
}

export default function BalancedBudgetBuilder({ onBack }: BalancedBudgetBuilderProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("spending")
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState("")

  // 2025 baseline budget items (post-"One Big Beautiful Bill Act")
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    // Spending Categories
    {
      id: "defense",
      name: "Defense Spending",
      current: 886,
      proposed: 886,
      min: 600,
      max: 1000,
      icon: <Shield className="h-5 w-5" />,
      description: "Military personnel, operations, procurement, and R&D",
      category: "spending",
      subcategory: "discretionary",
    },
    {
      id: "social_security",
      name: "Social Security",
      current: 1347,
      proposed: 1347,
      min: 1200,
      max: 1400,
      icon: <Users className="h-5 w-5" />,
      description: "Retirement, disability, and survivor benefits",
      category: "spending",
      subcategory: "mandatory",
    },
    {
      id: "medicare",
      name: "Medicare",
      current: 1019,
      proposed: 1019,
      min: 900,
      max: 1100,
      icon: <Heart className="h-5 w-5" />,
      description: "Healthcare for seniors and disabled",
      category: "spending",
      subcategory: "mandatory",
    },
    {
      id: "medicaid",
      name: "Medicaid",
      current: 616,
      proposed: 616,
      min: 500,
      max: 700,
      icon: <Heart className="h-5 w-5" />,
      description: "Healthcare for low-income individuals and families",
      category: "spending",
      subcategory: "mandatory",
    },
    {
      id: "interest",
      name: "Interest on Debt",
      current: 640,
      proposed: 640,
      min: 640,
      max: 640,
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Interest payments on national debt (fixed)",
      category: "spending",
      subcategory: "mandatory",
    },
    {
      id: "veterans",
      name: "Veterans Affairs",
      current: 303,
      proposed: 303,
      min: 250,
      max: 350,
      icon: <Shield className="h-5 w-5" />,
      description: "Healthcare, disability, and benefits for veterans",
      category: "spending",
      subcategory: "discretionary",
    },
    {
      id: "education",
      name: "Education",
      current: 80,
      proposed: 80,
      min: 50,
      max: 120,
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Federal education programs and student aid",
      category: "spending",
      subcategory: "discretionary",
    },
    {
      id: "other_discretionary",
      name: "Other Discretionary",
      current: 309,
      proposed: 309,
      min: 200,
      max: 400,
      icon: <Building2 className="h-5 w-5" />,
      description: "Transportation, justice, science, and other programs",
      category: "spending",
      subcategory: "discretionary",
    },

    // Revenue Categories
    {
      id: "individual_income",
      name: "Individual Income Tax",
      current: 2044,
      proposed: 2044,
      min: 1800,
      max: 2800,
      icon: <Users className="h-5 w-5" />,
      description: "Personal income tax from individuals",
      category: "revenue",
    },
    {
      id: "payroll_tax",
      name: "Payroll Tax",
      current: 1484,
      proposed: 1484,
      min: 1400,
      max: 1800,
      icon: <Building2 className="h-5 w-5" />,
      description: "Social Security and Medicare taxes",
      category: "revenue",
    },
    {
      id: "corporate_income",
      name: "Corporate Income Tax",
      current: 420,
      proposed: 420,
      min: 300,
      max: 800,
      icon: <Building2 className="h-5 w-5" />,
      description: "Tax on corporate profits",
      category: "revenue",
    },
    {
      id: "customs_duties",
      name: "Customs Duties",
      current: 365,
      proposed: 365,
      min: 80,
      max: 500,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Tariffs and import duties",
      category: "revenue",
    },
    {
      id: "other_revenue",
      name: "Other Revenue",
      current: 237,
      proposed: 237,
      min: 200,
      max: 400,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Estate taxes, fees, and other sources",
      category: "revenue",
    },
  ])

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      const id = await createBudgetSession()
      setSessionId(id)
      await trackInteraction(id, "started_budget_builder")
    } catch (error) {
      console.error("Error initializing session:", error)
    }
  }

  const updateBudgetItem = async (id: string, newValue: number) => {
    setBudgetItems((prev) => prev.map((item) => (item.id === id ? { ...item, proposed: newValue } : item)))

    if (sessionId) {
      await saveBudgetConfig(sessionId, id, newValue)
      await trackInteraction(sessionId, "adjusted_budget_item", { id, value: newValue })
    }
  }

  const calculateTotals = () => {
    const spending = budgetItems
      .filter((item) => item.category === "spending")
      .reduce((sum, item) => sum + item.proposed, 0)

    const revenue = budgetItems
      .filter((item) => item.category === "revenue")
      .reduce((sum, item) => sum + item.proposed, 0)

    const deficit = revenue - spending

    return { spending, revenue, deficit }
  }

  const applyScenario = async (scenario: string) => {
    setSelectedScenario(scenario)

    let adjustments: Record<string, number> = {}

    switch (scenario) {
      case "progressive":
        adjustments = {
          defense: 750,
          individual_income: 2400,
          corporate_income: 600,
          other_discretionary: 280,
        }
        break
      case "conservative":
        adjustments = {
          defense: 950,
          social_security: 1300,
          medicare: 980,
          medicaid: 580,
          education: 60,
          individual_income: 2200,
          corporate_income: 350,
        }
        break
      case "balanced":
        adjustments = {
          defense: 820,
          social_security: 1320,
          medicare: 1000,
          individual_income: 2200,
          corporate_income: 500,
          other_discretionary: 290,
        }
        break
    }

    setBudgetItems((prev) =>
      prev.map((item) => ({
        ...item,
        proposed: adjustments[item.id] || item.proposed,
      })),
    )

    if (sessionId) {
      await trackInteraction(sessionId, "applied_scenario", { scenario })
    }
  }

  const resetToBaseline = async () => {
    setBudgetItems((prev) => prev.map((item) => ({ ...item, proposed: item.current })))
    setSelectedScenario("")

    if (sessionId) {
      await trackInteraction(sessionId, "reset_to_baseline")
    }
  }

  const handleComplete = async () => {
    const { spending, revenue, deficit } = calculateTotals()

    if (sessionId) {
      await completeSession(sessionId, selectedScenario || "custom", deficit, spending, revenue)
    }

    setShowFeedbackModal(true)
  }

  const { spending, revenue, deficit } = calculateTotals()
  const isBalanced = deficit >= 0
  const deficitReduction = 2650 + deficit // Compared to 2025 baseline

  const spendingItems = budgetItems.filter((item) => item.category === "spending")
  const revenueItems = budgetItems.filter((item) => item.category === "revenue")

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
            <h1 className="text-3xl font-bold text-gray-900">Budget Builder</h1>
            <p className="text-gray-600">Balance the 2025 federal budget through spending and revenue adjustments</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Current Status */}
        <Card className={`border-2 ${isBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isBalanced ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-800">Budget Balanced!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <span className="text-red-800">Budget Deficit</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatLargeNumber(spending * 1000000000)}</div>
                <div className="text-sm text-blue-700">Total Spending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatLargeNumber(revenue * 1000000000)}</div>
                <div className="text-sm text-green-700">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                  {formatLargeNumber(Math.abs(deficit) * 1000000000)}
                </div>
                <div className={`text-sm ${isBalanced ? "text-green-700" : "text-red-700"}`}>
                  {isBalanced ? "Surplus" : "Deficit"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatLargeNumber(deficitReduction * 1000000000)}
                </div>
                <div className="text-sm text-purple-700">Deficit Reduction</div>
              </div>
            </div>

            {isBalanced && (
              <div className="mt-4 text-center">
                <Button onClick={handleComplete} size="lg" className="bg-green-600 hover:bg-green-700">
                  Complete & Share Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Scenarios</CardTitle>
            <CardDescription>Apply pre-configured budget approaches or build your own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedScenario === "progressive" ? "default" : "outline"}
                onClick={() => applyScenario("progressive")}
              >
                Progressive Approach
              </Button>
              <Button
                variant={selectedScenario === "conservative" ? "default" : "outline"}
                onClick={() => applyScenario("conservative")}
              >
                Conservative Approach
              </Button>
              <Button
                variant={selectedScenario === "balanced" ? "default" : "outline"}
                onClick={() => applyScenario("balanced")}
              >
                Balanced Approach
              </Button>
              <Button variant="outline" onClick={resetToBaseline}>
                Reset to Baseline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Budget Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spending">Spending ({spendingItems.length} categories)</TabsTrigger>
            <TabsTrigger value="revenue">Revenue ({revenueItems.length} sources)</TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="space-y-4">
            {spendingItems.map((item) => {
              const change = item.proposed - item.current
              const changePercent = (change / item.current) * 100

              return (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {item.icon}
                        {item.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatLargeNumber(item.proposed * 1000000000)}</div>
                        <div
                          className={`text-sm ${change > 0 ? "text-red-600" : change < 0 ? "text-green-600" : "text-gray-600"}`}
                        >
                          {change > 0 ? "+" : ""}
                          {formatLargeNumber(change * 1000000000)} ({changePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Slider
                        value={[item.proposed]}
                        onValueChange={(value) => updateBudgetItem(item.id, value[0])}
                        min={item.min}
                        max={item.max}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatLargeNumber(item.min * 1000000000)}</span>
                        <span>Current: {formatLargeNumber(item.current * 1000000000)}</span>
                        <span>{formatLargeNumber(item.max * 1000000000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            {revenueItems.map((item) => {
              const change = item.proposed - item.current
              const changePercent = (change / item.current) * 100

              return (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {item.icon}
                        {item.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatLargeNumber(item.proposed * 1000000000)}</div>
                        <div
                          className={`text-sm ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"}`}
                        >
                          {change > 0 ? "+" : ""}
                          {formatLargeNumber(change * 1000000000)} ({changePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Slider
                        value={[item.proposed]}
                        onValueChange={(value) => updateBudgetItem(item.id, value[0])}
                        min={item.min}
                        max={item.max}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatLargeNumber(item.min * 1000000000)}</span>
                        <span>Current: {formatLargeNumber(item.current * 1000000000)}</span>
                        <span>{formatLargeNumber(item.max * 1000000000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Progress Indicator */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Toward Balance</CardTitle>
            <CardDescription>
              {isBalanced
                ? "Congratulations! You've achieved a balanced budget."
                : `You need to reduce the deficit by ${formatLargeNumber(Math.abs(deficit) * 1000000000)} more to balance the budget.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={Math.min(100, Math.max(0, ((2650 + deficit) / 2650) * 100))} className="h-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$2.65T Deficit</span>
                <span>{formatPercentage(Math.min(1, Math.max(0, (2650 + deficit) / 2650)))} Complete</span>
                <span>Balanced</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Button */}
        {!isBalanced && (
          <div className="text-center">
            <Button onClick={handleComplete} size="lg" variant="outline">
              Complete Exercise & Share Results
            </Button>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <UserFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        sessionId={sessionId}
        budgetBalance={deficit}
        scenarioName={selectedScenario || "Custom Approach"}
      />
    </div>
  )
}
