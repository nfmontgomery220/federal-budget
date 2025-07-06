"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"
import { UserFeedbackModal } from "@/components/user-feedback-modal"
import { createBudgetSession, saveBudgetConfig, completeSession, trackInteraction } from "@/lib/budget-analytics"
import { formatBillions, formatPercent } from "@/utils/format-helpers"

interface BalancedBudgetBuilderProps {
  onBack: () => void
}

// 2025 Post-"One Big Beautiful Bill Act" Budget Data
const BUDGET_2025 = {
  totalSpending: 7200, // $7.2T total spending
  totalRevenue: 4550, // $4.55T total revenue
  deficit: 2650, // $2.65T deficit

  // Major spending categories (in billions)
  spending: {
    socialSecurity: 1400,
    medicare: 1100,
    medicaid: 650,
    defense: 850,
    interest: 900,
    veterans: 350,
    education: 280,
    transportation: 180,
    agriculture: 150,
    justice: 70,
    energy: 60,
    nasa: 25,
    epa: 12,
    other: 1163,
  },

  // Revenue sources (in billions)
  revenue: {
    individualIncome: 2100,
    payrollTax: 1650,
    corporateIncome: 450,
    customsDuties: 80,
    exciseTaxes: 65,
    estateTax: 25,
    other: 180,
  },
}

const PREBUILT_SCENARIOS = {
  progressive: {
    name: "Progressive Approach",
    description: "Higher taxes on wealthy, maintain social programs",
    spendingCuts: {
      defense: 200,
      other: 100,
    },
    revenueIncreases: {
      wealthTax: 400,
      corporateIncome: 300,
      capitalGains: 200,
      individualIncome: 250,
    },
  },
  conservative: {
    name: "Conservative Approach",
    description: "Reduce spending, minimal tax increases",
    spendingCuts: {
      socialSecurity: 150,
      medicare: 200,
      medicaid: 150,
      education: 100,
      other: 200,
    },
    revenueIncreases: {
      economicGrowth: 300,
    },
  },
  centrist: {
    name: "Centrist Compromise",
    description: "Balanced mix of cuts and revenue increases",
    spendingCuts: {
      defense: 100,
      medicare: 100,
      other: 150,
    },
    revenueIncreases: {
      vatTax: 500,
      corporateIncome: 150,
      closingLoopholes: 200,
    },
  },
}

export default function BalancedBudgetBuilder({ onBack }: BalancedBudgetBuilderProps) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime] = useState(Date.now())
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [customMode, setCustomMode] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Spending cuts (in billions)
  const [spendingCuts, setSpendingCuts] = useState({
    socialSecurity: 0,
    medicare: 0,
    medicaid: 0,
    defense: 0,
    veterans: 0,
    education: 0,
    transportation: 0,
    agriculture: 0,
    other: 0,
  })

  // Revenue increases (in billions)
  const [revenueIncreases, setRevenueIncreases] = useState({
    individualIncome: 0,
    corporateIncome: 0,
    wealthTax: 0,
    vatTax: 0,
    carbonTax: 0,
    financialTransaction: 0,
    capitalGains: 0,
    closingLoopholes: 0,
    economicGrowth: 0,
  })

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const id = await createBudgetSession()
      if (id) {
        setSessionId(id)
      }
    }
    initSession()
  }, [])

  // Track interactions
  const trackUserAction = (action: string, target: string, value?: string) => {
    if (sessionId) {
      trackInteraction(sessionId, action, target, value)
    }
  }

  // Apply prebuilt scenario
  const applyScenario = (scenarioKey: string) => {
    const scenario = PREBUILT_SCENARIOS[scenarioKey as keyof typeof PREBUILT_SCENARIOS]
    if (!scenario) return

    setSelectedScenario(scenarioKey)
    setCustomMode(false)

    // Reset all values
    setSpendingCuts({
      socialSecurity: 0,
      medicare: 0,
      medicaid: 0,
      defense: 0,
      veterans: 0,
      education: 0,
      transportation: 0,
      agriculture: 0,
      other: 0,
    })

    setRevenueIncreases({
      individualIncome: 0,
      corporateIncome: 0,
      wealthTax: 0,
      vatTax: 0,
      carbonTax: 0,
      financialTransaction: 0,
      capitalGains: 0,
      closingLoopholes: 0,
      economicGrowth: 0,
    })

    // Apply scenario values
    Object.entries(scenario.spendingCuts).forEach(([key, value]) => {
      setSpendingCuts((prev) => ({ ...prev, [key]: value }))
    })

    Object.entries(scenario.revenueIncreases).forEach(([key, value]) => {
      setRevenueIncreases((prev) => ({ ...prev, [key]: value }))
    })

    trackUserAction("apply_scenario", scenarioKey)
  }

  // Switch to custom mode
  const enableCustomMode = () => {
    setCustomMode(true)
    setSelectedScenario("")
    trackUserAction("enable_custom_mode", "custom")
  }

  // Calculate totals
  const totalSpendingCuts = Object.values(spendingCuts).reduce((sum, cut) => sum + cut, 0)
  const totalRevenueIncreases = Object.values(revenueIncreases).reduce((sum, increase) => sum + increase, 0)
  const newDeficit = BUDGET_2025.deficit - totalSpendingCuts - totalRevenueIncreases
  const isBalanced = newDeficit <= 0

  // Handle completion
  const handleComplete = async () => {
    if (!sessionId) return

    const duration = Math.round((Date.now() - sessionStartTime) / 1000)
    const scenarioName = selectedScenario
      ? PREBUILT_SCENARIOS[selectedScenario as keyof typeof PREBUILT_SCENARIOS].name
      : "Custom Approach"

    await Promise.all([
      saveBudgetConfig(
        sessionId,
        2025,
        scenarioName,
        selectedScenario ? "prebuilt" : "custom",
        -newDeficit, // Convert to positive for surplus, negative for deficit
        totalSpendingCuts,
        totalRevenueIncreases,
        spendingCuts,
        revenueIncreases,
      ),
      completeSession(sessionId, duration),
    ])

    setShowFeedbackModal(true)
  }

  const getStatusColor = () => {
    if (isBalanced) return "text-green-600"
    if (newDeficit < BUDGET_2025.deficit * 0.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = () => {
    if (isBalanced) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (newDeficit < BUDGET_2025.deficit * 0.5) return <Target className="h-5 w-5 text-yellow-600" />
    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Balance the 2025 Federal Budget</h1>
      </div>

      {/* Current Status */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatBillions(BUDGET_2025.deficit)}</div>
              <div className="text-sm text-muted-foreground">Starting Deficit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatBillions(totalSpendingCuts)}</div>
              <div className="text-sm text-muted-foreground">Spending Cuts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatBillions(totalRevenueIncreases)}</div>
              <div className="text-sm text-muted-foreground">Revenue Increases</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {newDeficit > 0 ? formatBillions(newDeficit) : formatBillions(Math.abs(newDeficit))}
              </div>
              <div className="text-sm text-muted-foreground">
                {newDeficit > 0 ? "Remaining Deficit" : "Budget Surplus"}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={Math.min(((BUDGET_2025.deficit - newDeficit) / BUDGET_2025.deficit) * 100, 100)}
              className="h-3"
            />
            <div className="text-center text-sm text-muted-foreground mt-2">
              {formatPercent(Math.min(((BUDGET_2025.deficit - newDeficit) / BUDGET_2025.deficit) * 100, 100))}
              progress toward balance
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Approach</CardTitle>
          <CardDescription>Start with a prebuilt scenario or create your own custom solution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(PREBUILT_SCENARIOS).map(([key, scenario]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedScenario === key ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => applyScenario(key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  <CardDescription className="text-sm">{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-1">
                    <div>Cuts: {formatBillions(Object.values(scenario.spendingCuts).reduce((a, b) => a + b, 0))}</div>
                    <div>
                      Revenue: {formatBillions(Object.values(scenario.revenueIncreases).reduce((a, b) => a + b, 0))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" onClick={enableCustomMode} className="w-full bg-transparent">
            <DollarSign className="h-4 w-4 mr-2" />
            Create Custom Solution
          </Button>
        </CardContent>
      </Card>

      {/* Budget Controls */}
      <Tabs defaultValue="spending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending">Spending Cuts</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Increases</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Reduce Federal Spending
              </CardTitle>
              <CardDescription>
                Cut spending in various categories. Current total: {formatBillions(totalSpendingCuts)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(BUDGET_2025.spending).map(([category, amount]) => {
                const cutKey = category as keyof typeof spendingCuts
                const currentCut = spendingCuts[cutKey] || 0
                const maxCut = Math.floor(amount * 0.5) // Max 50% cut

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-medium capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</label>
                      <div className="text-sm text-muted-foreground">
                        {formatBillions(amount)} → {formatBillions(amount - currentCut)}
                      </div>
                    </div>
                    <Slider
                      value={[currentCut]}
                      onValueChange={([value]) => {
                        setSpendingCuts((prev) => ({ ...prev, [cutKey]: value }))
                        trackUserAction("adjust_spending", category, value.toString())
                      }}
                      max={maxCut}
                      step={5}
                      className="w-full"
                      disabled={!customMode && !selectedScenario}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0B</span>
                      <span className="font-medium">Cut: {formatBillions(currentCut)}</span>
                      <span>Max: {formatBillions(maxCut)}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Increase Federal Revenue
              </CardTitle>
              <CardDescription>
                Raise revenue through various methods. Current total: {formatBillions(totalRevenueIncreases)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Individual Income Tax Increase</label>
                  <div className="text-sm text-muted-foreground">Higher rates on top brackets</div>
                </div>
                <Slider
                  value={[revenueIncreases.individualIncome]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, individualIncome: value }))
                    trackUserAction("adjust_revenue", "individualIncome", value.toString())
                  }}
                  max={500}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.individualIncome)}</span>
                  <span>Max: $500B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Corporate Tax Increase</label>
                  <div className="text-sm text-muted-foreground">Raise corporate rate from 21%</div>
                </div>
                <Slider
                  value={[revenueIncreases.corporateIncome]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, corporateIncome: value }))
                    trackUserAction("adjust_revenue", "corporateIncome", value.toString())
                  }}
                  max={400}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.corporateIncome)}</span>
                  <span>Max: $400B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Wealth Tax</label>
                  <div className="text-sm text-muted-foreground">Tax on net worth over $50M</div>
                </div>
                <Slider
                  value={[revenueIncreases.wealthTax]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, wealthTax: value }))
                    trackUserAction("adjust_revenue", "wealthTax", value.toString())
                  }}
                  max={600}
                  step={50}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.wealthTax)}</span>
                  <span>Max: $600B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Value Added Tax (VAT)</label>
                  <div className="text-sm text-muted-foreground">10% VAT on goods and services</div>
                </div>
                <Slider
                  value={[revenueIncreases.vatTax]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, vatTax: value }))
                    trackUserAction("adjust_revenue", "vatTax", value.toString())
                  }}
                  max={800}
                  step={50}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.vatTax)}</span>
                  <span>Max: $800B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Carbon Tax</label>
                  <div className="text-sm text-muted-foreground">$50 per ton of CO2</div>
                </div>
                <Slider
                  value={[revenueIncreases.carbonTax]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, carbonTax: value }))
                    trackUserAction("adjust_revenue", "carbonTax", value.toString())
                  }}
                  max={300}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.carbonTax)}</span>
                  <span>Max: $300B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Financial Transaction Tax</label>
                  <div className="text-sm text-muted-foreground">0.1% on stock trades</div>
                </div>
                <Slider
                  value={[revenueIncreases.financialTransaction]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, financialTransaction: value }))
                    trackUserAction("adjust_revenue", "financialTransaction", value.toString())
                  }}
                  max={200}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.financialTransaction)}</span>
                  <span>Max: $200B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Capital Gains Tax Increase</label>
                  <div className="text-sm text-muted-foreground">Tax as ordinary income</div>
                </div>
                <Slider
                  value={[revenueIncreases.capitalGains]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, capitalGains: value }))
                    trackUserAction("adjust_revenue", "capitalGains", value.toString())
                  }}
                  max={300}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.capitalGains)}</span>
                  <span>Max: $300B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Close Tax Loopholes</label>
                  <div className="text-sm text-muted-foreground">Corporate and individual</div>
                </div>
                <Slider
                  value={[revenueIncreases.closingLoopholes]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, closingLoopholes: value }))
                    trackUserAction("adjust_revenue", "closingLoopholes", value.toString())
                  }}
                  max={400}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.closingLoopholes)}</span>
                  <span>Max: $400B</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Economic Growth Revenue</label>
                  <div className="text-sm text-muted-foreground">From pro-growth policies</div>
                </div>
                <Slider
                  value={[revenueIncreases.economicGrowth]}
                  onValueChange={([value]) => {
                    setRevenueIncreases((prev) => ({ ...prev, economicGrowth: value }))
                    trackUserAction("adjust_revenue", "economicGrowth", value.toString())
                  }}
                  max={500}
                  step={25}
                  disabled={!customMode && !selectedScenario}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0B</span>
                  <span className="font-medium">+{formatBillions(revenueIncreases.economicGrowth)}</span>
                  <span>Max: $500B</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleComplete}
          disabled={!sessionId}
          size="lg"
          className={isBalanced ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isBalanced ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Balanced Budget
            </>
          ) : (
            <>
              <Target className="h-5 w-5 mr-2" />
              Save Progress
            </>
          )}
        </Button>
      </div>

      {/* Feedback Modal */}
      <UserFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        sessionId={sessionId || ""}
        budgetBalance={-newDeficit}
        scenarioName={
          selectedScenario
            ? PREBUILT_SCENARIOS[selectedScenario as keyof typeof PREBUILT_SCENARIOS].name
            : "Custom Approach"
        }
      />
    </div>
  )
}
