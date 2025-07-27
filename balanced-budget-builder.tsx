"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Save,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
  Heart,
  GraduationCap,
  Building,
  Zap,
} from "lucide-react"
import { createBudgetSession, saveBudgetConfig, completeSession, trackInteraction } from "@/lib/budget-analytics"

interface BudgetCategory {
  id: string
  name: string
  current: number
  min: number
  max: number
  type: "spending" | "revenue"
  icon: any
  description: string
  impact: string
}

const budgetCategories: BudgetCategory[] = [
  // Spending Categories
  {
    id: "defense",
    name: "Defense",
    current: 816,
    min: 400,
    max: 1000,
    type: "spending",
    icon: Shield,
    description: "Military spending, veterans benefits, and national security",
    impact: "Affects military readiness and veteran services",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    current: 1355,
    min: 800,
    max: 1800,
    type: "spending",
    icon: Heart,
    description: "Medicare, Medicaid, and health programs",
    impact: "Impacts healthcare access for seniors and low-income families",
  },
  {
    id: "social_security",
    name: "Social Security",
    current: 1347,
    min: 1000,
    max: 1600,
    type: "spending",
    icon: Users,
    description: "Retirement and disability benefits",
    impact: "Affects retirement security for 67 million Americans",
  },
  {
    id: "education",
    name: "Education",
    current: 80,
    min: 40,
    max: 200,
    type: "spending",
    icon: GraduationCap,
    description: "Federal education programs and student aid",
    impact: "Influences educational opportunities and student debt",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    current: 65,
    min: 30,
    max: 150,
    type: "spending",
    icon: Building,
    description: "Transportation, broadband, and public works",
    impact: "Affects economic competitiveness and job creation",
  },
  {
    id: "energy",
    name: "Energy & Environment",
    current: 45,
    min: 20,
    max: 120,
    type: "spending",
    icon: Zap,
    description: "Clean energy, climate programs, and EPA",
    impact: "Influences climate goals and energy independence",
  },
  // Revenue Categories
  {
    id: "income_tax",
    name: "Income Tax Rate",
    current: 2044,
    min: 1500,
    max: 2800,
    type: "revenue",
    icon: DollarSign,
    description: "Individual income tax collections",
    impact: "Higher rates increase revenue but may reduce economic growth",
  },
  {
    id: "corporate_tax",
    name: "Corporate Tax",
    current: 420,
    min: 200,
    max: 800,
    type: "revenue",
    icon: Building,
    description: "Corporate income tax collections",
    impact: "Affects business investment and competitiveness",
  },
  {
    id: "payroll_tax",
    name: "Payroll Tax",
    current: 1614,
    min: 1400,
    max: 2000,
    type: "revenue",
    icon: Users,
    description: "Social Security and Medicare taxes",
    impact: "Directly tied to Social Security and Medicare funding",
  },
]

const BASELINE_DEFICIT = -1833 // FY 2025 projected deficit

export default function BalancedBudgetBuilder() {
  const [sessionId, setSessionId] = useState<string>("")
  const [values, setValues] = useState<Record<string, number>>({})
  const [savedScenario, setSavedScenario] = useState<string>("")
  const [activeTab, setActiveTab] = useState("spending")
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Initialize session and default values
    const initSession = async () => {
      try {
        const id = await createBudgetSession()
        setSessionId(id)

        // Set default values
        const defaultValues: Record<string, number> = {}
        budgetCategories.forEach((cat) => {
          defaultValues[cat.id] = cat.current
        })
        setValues(defaultValues)
      } catch (error) {
        console.error("Failed to initialize session:", error)
      }
    }

    initSession()
  }, [])

  const handleValueChange = async (categoryId: string, newValue: number[]) => {
    const value = newValue[0]
    setValues((prev) => ({ ...prev, [categoryId]: value }))

    if (sessionId) {
      await saveBudgetConfig(sessionId, categoryId, value)
      await trackInteraction(sessionId, "slider_change", categoryId, value.toString())
    }
  }

  const resetToDefaults = () => {
    const defaultValues: Record<string, number> = {}
    budgetCategories.forEach((cat) => {
      defaultValues[cat.id] = cat.current
    })
    setValues(defaultValues)
    setSavedScenario("")
    setShowResults(false)
  }

  const calculateTotals = () => {
    const spending = budgetCategories
      .filter((cat) => cat.type === "spending")
      .reduce((sum, cat) => sum + (values[cat.id] || cat.current), 0)

    const revenue = budgetCategories
      .filter((cat) => cat.type === "revenue")
      .reduce((sum, cat) => sum + (values[cat.id] || cat.current), 0)

    const balance = revenue - spending
    const deficitChange = balance - BASELINE_DEFICIT

    return { spending, revenue, balance, deficitChange }
  }

  const saveScenario = async () => {
    const { spending, revenue, balance } = calculateTotals()
    const scenarioName = `Budget Scenario ${new Date().toLocaleDateString()}`

    if (sessionId) {
      await completeSession(sessionId, scenarioName, balance, spending, revenue)
      await trackInteraction(sessionId, "scenario_saved", "save_button")
    }

    setSavedScenario(scenarioName)
    setShowResults(true)
  }

  const { spending, revenue, balance, deficitChange } = calculateTotals()
  const isBalanced = Math.abs(balance) < 50 // Within $50B is considered "balanced"
  const balanceColor = balance > 0 ? "text-green-600" : balance < -500 ? "text-red-600" : "text-orange-600"

  const spendingCategories = budgetCategories.filter((cat) => cat.type === "spending")
  const revenueCategories = budgetCategories.filter((cat) => cat.type === "revenue")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Builder</h1>
          <p className="text-muted-foreground">Adjust spending and revenue to create your balanced budget proposal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveScenario}>
            <Save className="h-4 w-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${spending.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Total Spending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${revenue.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {isBalanced ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              )}
              <div className="text-right">
                <p className={`text-2xl font-bold ${balanceColor}`}>
                  {balance > 0 ? "+" : ""}${balance.toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">{balance > 0 ? "Surplus" : "Deficit"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className={`text-2xl font-bold ${deficitChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {deficitChange > 0 ? "+" : ""}${deficitChange.toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">vs. Baseline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Status */}
      {isBalanced ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Congratulations!</strong> Your budget is balanced within $50B. This represents a significant
            improvement over the baseline deficit.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your budget has a {balance > 0 ? "surplus" : "deficit"} of ${Math.abs(balance).toFixed(0)}B.
            {balance < 0
              ? " Consider reducing spending or increasing revenue."
              : " Consider how to use this surplus effectively."}
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending">Spending Categories</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4">
            {spendingCategories.map((category) => {
              const Icon = category.icon
              const currentValue = values[category.id] || category.current
              const change = currentValue - category.current
              const changePercent = ((change / category.current) * 100).toFixed(1)

              return (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${currentValue.toFixed(0)}B</p>
                        {change !== 0 && (
                          <Badge variant={change > 0 ? "destructive" : "default"}>
                            {change > 0 ? "+" : ""}${change.toFixed(0)}B ({changePercent}%)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={[currentValue]}
                        onValueChange={(value) => handleValueChange(category.id, value)}
                        max={category.max}
                        min={category.min}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${category.min}B</span>
                        <span>Current: ${category.current}B</span>
                        <span>${category.max}B</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">{category.impact}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4">
            {revenueCategories.map((category) => {
              const Icon = category.icon
              const currentValue = values[category.id] || category.current
              const change = currentValue - category.current
              const changePercent = ((change / category.current) * 100).toFixed(1)

              return (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${currentValue.toFixed(0)}B</p>
                        {change !== 0 && (
                          <Badge variant={change > 0 ? "default" : "destructive"}>
                            {change > 0 ? "+" : ""}${change.toFixed(0)}B ({changePercent}%)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={[currentValue]}
                        onValueChange={(value) => handleValueChange(category.id, value)}
                        max={category.max}
                        min={category.min}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${category.min}B</span>
                        <span>Current: ${category.current}B</span>
                        <span>${category.max}B</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">{category.impact}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {showResults && savedScenario && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Scenario Saved: {savedScenario}
            </CardTitle>
            <CardDescription>
              Your budget scenario has been saved and can be shared or analyzed further.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-red-600">${spending.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Total Spending</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">${revenue.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className={`text-2xl font-bold ${balanceColor}`}>
                  {balance > 0 ? "+" : ""}${balance.toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">{balance > 0 ? "Surplus" : "Deficit"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
