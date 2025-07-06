"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Calculator, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Tax design data for raising $476B
const taxDesignData = {
  2024: {
    targetRevenue: 476, // Remaining gap after spending cuts

    // Current tax bases and potential
    existingTaxes: {
      individual: {
        current: 2042,
        maxIncrease: 150, // Without major rate hikes
        difficulty: "Medium",
        description: "Modest rate increases, bracket adjustments",
      },
      corporate: {
        current: 420,
        maxIncrease: 89, // 21% to 28%
        difficulty: "Medium",
        description: "Raise rate to 28%, close loopholes",
      },
      payroll: {
        current: 1614,
        maxIncrease: 234, // Remove SS cap, add Medicare
        difficulty: "Hard",
        description: "Remove Social Security cap, add 2% Medicare",
      },
      estate: {
        current: 34,
        maxIncrease: 45, // Lower exemption, higher rates
        difficulty: "Medium",
        description: "Lower exemption to $5M, raise rates",
      },
    },

    // New tax categories
    newTaxes: {
      vat: {
        potential: 255, // 5% VAT
        rate: 5,
        base: 5100, // Consumer spending base
        difficulty: "Very Hard",
        description: "Value Added Tax on goods and services",
        exemptions: ["Food", "Medicine", "Housing"],
        regressivity: "High",
      },
      carbonTax: {
        potential: 120, // $50/ton CO2
        rate: 50,
        base: 2.4, // Billion tons CO2
        difficulty: "Hard",
        description: "Carbon tax on fossil fuel emissions",
        exemptions: ["Low-income rebates"],
        regressivity: "Medium",
      },
      wealthTax: {
        potential: 178, // 1% on wealth >$10M
        rate: 1,
        base: 17800, // Wealth base >$10M
        difficulty: "Very Hard",
        description: "Annual tax on net worth above $10M",
        exemptions: ["Primary residence", "Small business"],
        regressivity: "Progressive",
      },
      financialTransaction: {
        potential: 89, // 0.1% on trades
        rate: 0.1,
        base: 89000, // Trading volume
        difficulty: "Medium",
        description: "Tax on stock, bond, and derivative trades",
        exemptions: ["Retirement accounts", "Small trades"],
        regressivity: "Progressive",
      },
      digitalServices: {
        potential: 34, // 7% on tech giants
        rate: 7,
        base: 486, // Digital services revenue
        difficulty: "Medium",
        description: "Tax on digital advertising and platform revenue",
        exemptions: ["Small businesses"],
        regressivity: "Progressive",
      },
      landValue: {
        potential: 67, // 0.5% on land value
        rate: 0.5,
        base: 13400, // Total land value
        difficulty: "Hard",
        description: "Tax on unimproved land value",
        exemptions: ["Agricultural land", "Conservation"],
        regressivity: "Mixed",
      },
    },

    // Pre-designed scenarios
    scenarios: [
      {
        name: "Equal Burden Approach",
        description: "Spread burden across all income levels and new taxes",
        individual: 45, // Minimal income tax increase
        corporate: 67,
        payroll: 89, // Partial SS cap removal
        vat: 127, // 2.5% VAT
        carbonTax: 67, // $28/ton
        wealthTax: 45, // 0.5% rate
        financialTransaction: 36,
        total: 476,
        regressivity: "Neutral",
        difficulty: "Very Hard",
      },
      {
        name: "Progressive Focus",
        description: "Minimize burden on middle/lower income",
        individual: 23, // Only top brackets
        corporate: 89,
        payroll: 45, // Only Medicare expansion
        vat: 0, // No regressive VAT
        carbonTax: 89, // With rebates
        wealthTax: 134, // Higher wealth tax
        financialTransaction: 67,
        digitalServices: 29,
        total: 476,
        regressivity: "Progressive",
        difficulty: "Extreme",
      },
      {
        name: "Broad Base Approach",
        description: "Lower rates across wider tax base",
        individual: 67,
        corporate: 56,
        payroll: 134, // Full reform
        vat: 178, // 3.5% VAT
        carbonTax: 41,
        total: 476,
        regressivity: "Slightly Regressive",
        difficulty: "Very Hard",
      },
    ],

    // Impact by income group
    distributionalImpact: {
      bottom20: { currentTax: 2.3, impact: [0.8, 0.2, 1.2] }, // Equal, Progressive, Broad
      middle20_40: { currentTax: 8.4, impact: [1.4, 0.6, 2.1] },
      middle40_60: { currentTax: 14.1, impact: [2.1, 1.1, 2.8] },
      upper60_80: { currentTax: 22.2, impact: [2.8, 1.8, 3.4] },
      upper80_95: { currentTax: 28.6, impact: [3.2, 2.4, 3.9] },
      top95_99: { currentTax: 16.5, impact: [4.1, 3.8, 4.2] },
      top1: { currentTax: 7.9, impact: [5.2, 8.9, 4.8] },
    },
  },
}

interface TaxDesignCalculatorProps {
  onBack?: () => void
}

export default function TaxDesignCalculator({ onBack }: TaxDesignCalculatorProps) {
  const [activeTab, setActiveTab] = useState("calculator")
  const [selectedScenario, setSelectedScenario] = useState("Equal Burden Approach")
  const [customTaxes, setCustomTaxes] = useState({
    individual: 45,
    corporate: 67,
    payroll: 89,
    vat: 127,
    carbonTax: 67,
    wealthTax: 45,
    financialTransaction: 36,
    digitalServices: 0,
    landValue: 0,
  })

  const currentData = taxDesignData[2024]

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const calculateTotal = () => {
    return Object.values(customTaxes).reduce((sum, value) => sum + value, 0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-orange-100 text-orange-800"
      case "very hard":
        return "bg-red-100 text-red-800"
      case "extreme":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRegressivityColor = (regressivity: string) => {
    switch (regressivity.toLowerCase()) {
      case "progressive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-blue-100 text-blue-800"
      case "slightly regressive":
        return "bg-yellow-100 text-yellow-800"
      case "regressive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const taxOptions = [
    { key: "individual", name: "Individual Income", max: 150, current: currentData.existingTaxes.individual.current },
    { key: "corporate", name: "Corporate Income", max: 89, current: currentData.existingTaxes.corporate.current },
    { key: "payroll", name: "Payroll Taxes", max: 234, current: currentData.existingTaxes.payroll.current },
    { key: "vat", name: "Value Added Tax", max: 255, current: 0 },
    { key: "carbonTax", name: "Carbon Tax", max: 120, current: 0 },
    { key: "wealthTax", name: "Wealth Tax", max: 178, current: 0 },
    { key: "financialTransaction", name: "Financial Transaction", max: 89, current: 0 },
    { key: "digitalServices", name: "Digital Services", max: 34, current: 0 },
    { key: "landValue", name: "Land Value Tax", max: 67, current: 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Guns vs Butter
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Tax Design Calculator</h1>
            </div>
            <p className="text-gray-600">
              Design an "equal burden" approach to raise the remaining {formatBillions(currentData.targetRevenue)}
              while minimizing income tax increases
            </p>
          </div>
        </div>

        {/* The Challenge */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              The Tax Design Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatBillions(476)}</div>
                <div className="text-sm text-blue-700">Revenue Target</div>
                <div className="text-xs text-gray-600">After max spending cuts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatBillions(150)}</div>
                <div className="text-sm text-green-700">Max Income Tax</div>
                <div className="text-xs text-gray-600">Without major rate hikes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatBillions(326)}</div>
                <div className="text-sm text-orange-700">Need New Sources</div>
                <div className="text-xs text-gray-600">From new tax categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">9</div>
                <div className="text-sm text-purple-700">Tax Categories</div>
                <div className="text-xs text-gray-600">To spread the burden</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Custom Calculator</TabsTrigger>
            <TabsTrigger value="scenarios">Pre-designed Scenarios</TabsTrigger>
            <TabsTrigger value="categories">Tax Categories</TabsTrigger>
            <TabsTrigger value="impact">Distributional Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tax Sliders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Design Your Tax Mix
                  </CardTitle>
                  <CardDescription>
                    Adjust each tax category to reach {formatBillions(currentData.targetRevenue)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {taxOptions.map((tax) => (
                      <div key={tax.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">{tax.name}</label>
                          <div className="text-sm">
                            {formatBillions(customTaxes[tax.key as keyof typeof customTaxes])} /{" "}
                            {formatBillions(tax.max)}
                          </div>
                        </div>
                        <Slider
                          value={[customTaxes[tax.key as keyof typeof customTaxes]]}
                          onValueChange={(value) => setCustomTaxes({ ...customTaxes, [tax.key]: value[0] })}
                          max={tax.max}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600">
                          {tax.current > 0 ? `Current: ${formatBillions(tax.current)}` : "New tax category"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900">Total Revenue</h4>
                        <div className="text-3xl font-bold text-blue-600">{formatBillions(calculateTotal())}</div>
                        <div className="text-sm text-blue-700">Target: {formatBillions(currentData.targetRevenue)}</div>
                      </div>

                      <div
                        className={`p-4 rounded-lg ${calculateTotal() >= currentData.targetRevenue ? "bg-green-50" : "bg-red-50"}`}
                      >
                        <h4
                          className={`font-medium ${calculateTotal() >= currentData.targetRevenue ? "text-green-900" : "text-red-900"}`}
                        >
                          Gap Status
                        </h4>
                        <div
                          className={`text-2xl font-bold ${calculateTotal() >= currentData.targetRevenue ? "text-green-600" : "text-red-600"}`}
                        >
                          {calculateTotal() >= currentData.targetRevenue
                            ? "Target Met!"
                            : formatBillions(currentData.targetRevenue - calculateTotal())}
                        </div>
                        <div
                          className={`text-sm ${calculateTotal() >= currentData.targetRevenue ? "text-green-700" : "text-red-700"}`}
                        >
                          {calculateTotal() >= currentData.targetRevenue ? "Revenue target achieved" : "Still needed"}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900">Income Tax Minimization</h4>
                        <div className="text-xl font-bold text-yellow-600">
                          {formatBillions(customTaxes.individual)}
                        </div>
                        <div className="text-sm text-yellow-700">
                          {formatPercent((customTaxes.individual / calculateTotal()) * 100)} of total
                          {customTaxes.individual <= 150 ? " ✓ Minimized" : " ⚠ High"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tax Mix Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{ amount: { label: "Amount", color: "hsl(var(--chart-1))" } }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{data.name}</p>
                                    <p className="text-sm text-gray-600">{formatBillions(data.value)}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <PieChart
                            data={taxOptions
                              .filter((tax) => customTaxes[tax.key as keyof typeof customTaxes] > 0)
                              .map((tax) => ({
                                name: tax.name,
                                value: customTaxes[tax.key as keyof typeof customTaxes],
                              }))}
                          >
                            {taxOptions.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                            ))}
                          </PieChart>
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentData.scenarios.map((scenario, index) => (
                <Card key={index} className={selectedScenario === scenario.name ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">{scenario.name}</span>
                      <Button
                        variant={selectedScenario === scenario.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedScenario(scenario.name)}
                      >
                        Select
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-xs">{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{formatBillions(scenario.total)}</div>
                        <div className="text-xs text-gray-600">Total Revenue</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {scenario.individual > 0 && (
                          <div className="flex justify-between">
                            <span>Individual Income:</span>
                            <span className="font-medium">{formatBillions(scenario.individual)}</span>
                          </div>
                        )}
                        {scenario.corporate > 0 && (
                          <div className="flex justify-between">
                            <span>Corporate:</span>
                            <span className="font-medium">{formatBillions(scenario.corporate)}</span>
                          </div>
                        )}
                        {scenario.payroll > 0 && (
                          <div className="flex justify-between">
                            <span>Payroll:</span>
                            <span className="font-medium">{formatBillions(scenario.payroll)}</span>
                          </div>
                        )}
                        {scenario.vat > 0 && (
                          <div className="flex justify-between">
                            <span>VAT:</span>
                            <span className="font-medium">{formatBillions(scenario.vat)}</span>
                          </div>
                        )}
                        {scenario.carbonTax > 0 && (
                          <div className="flex justify-between">
                            <span>Carbon Tax:</span>
                            <span className="font-medium">{formatBillions(scenario.carbonTax)}</span>
                          </div>
                        )}
                        {scenario.wealthTax > 0 && (
                          <div className="flex justify-between">
                            <span>Wealth Tax:</span>
                            <span className="font-medium">{formatBillions(scenario.wealthTax)}</span>
                          </div>
                        )}
                        {scenario.financialTransaction > 0 && (
                          <div className="flex justify-between">
                            <span>Financial Transaction:</span>
                            <span className="font-medium">{formatBillions(scenario.financialTransaction)}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Badge className={getRegressivityColor(scenario.regressivity)} size="sm">
                          {scenario.regressivity}
                        </Badge>
                        <Badge className={getDifficultyColor(scenario.difficulty)} size="sm">
                          {scenario.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Scenario Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedScenario} - Implementation Details</CardTitle>
                <CardDescription>What this approach means in practice</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scenario = currentData.scenarios.find((s) => s.name === selectedScenario)
                  if (!scenario) return null

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Key Features</h4>
                        <div className="space-y-3">
                          {scenario.name === "Equal Burden Approach" && (
                            <>
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-900">Balanced Mix</h5>
                                <p className="text-sm text-blue-700">
                                  Spreads burden across income levels and new tax bases. 2.5% VAT with exemptions,
                                  modest carbon tax with rebates.
                                </p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-900">Income Tax Minimized</h5>
                                <p className="text-sm text-green-700">
                                  Only {formatBillions(45)} from income taxes (9.5% of total) - achieves your goal of
                                  minimizing income tax reliance.
                                </p>
                              </div>
                            </>
                          )}
                          {scenario.name === "Progressive Focus" && (
                            <>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-900">Protects Lower Income</h5>
                                <p className="text-sm text-green-700">
                                  No VAT, carbon tax with full rebates, focuses on wealth and financial transactions.
                                </p>
                              </div>
                              <div className="p-3 bg-red-50 rounded-lg">
                                <h5 className="font-medium text-red-900">Extreme Difficulty</h5>
                                <p className="text-sm text-red-700">
                                  Wealth tax faces constitutional challenges, very high rates needed on small base.
                                </p>
                              </div>
                            </>
                          )}
                          {scenario.name === "Broad Base Approach" && (
                            <>
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <h5 className="font-medium text-yellow-900">Lower Rates, Wider Base</h5>
                                <p className="text-sm text-yellow-700">
                                  3.5% VAT, full payroll reform, moderate income tax increases across brackets.
                                </p>
                              </div>
                              <div className="p-3 bg-orange-50 rounded-lg">
                                <h5 className="font-medium text-orange-900">Middle Class Impact</h5>
                                <p className="text-sm text-orange-700">
                                  More burden on middle class but potentially more stable revenue base.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Implementation Challenges</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-900">Political Feasibility</h5>
                            <p className="text-sm text-red-700">
                              {scenario.difficulty === "Extreme"
                                ? "Requires unprecedented political consensus and multiple election cycles."
                                : "Very difficult but potentially achievable with crisis motivation and strong leadership."}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-yellow-900">Administrative Complexity</h5>
                            <p className="text-sm text-yellow-700">
                              New tax systems require 3-5 years to implement. VAT needs complete administrative
                              overhaul.
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900">Economic Effects</h5>
                            <p className="text-sm text-blue-700">
                              Behavioral responses reduce actual revenue by 15-25%. Dynamic scoring essential.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Taxes */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Tax Categories</CardTitle>
                  <CardDescription>Current taxes and their expansion potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(currentData.existingTaxes).map(([key, tax]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h4>
                          <Badge className={getDifficultyColor(tax.difficulty)}>{tax.difficulty}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current: </span>
                            <span className="font-medium">{formatBillions(tax.current)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Max Increase: </span>
                            <span className="font-medium">{formatBillions(tax.maxIncrease)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{tax.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Taxes */}
              <Card>
                <CardHeader>
                  <CardTitle>New Tax Categories</CardTitle>
                  <CardDescription>Potential new revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(currentData.newTaxes).map(([key, tax]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            {tax.description.split(" ")[0]} {tax.description.split(" ")[1]}
                          </h4>
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(tax.difficulty)} size="sm">
                              {tax.difficulty}
                            </Badge>
                            <Badge className={getRegressivityColor(tax.regressivity)} size="sm">
                              {tax.regressivity}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Potential: </span>
                            <span className="font-medium">{formatBillions(tax.potential)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Rate: </span>
                            <span className="font-medium">{tax.rate}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{tax.description}</p>
                        {tax.exemptions.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Exemptions: </span>
                            <span className="text-xs text-gray-600">{tax.exemptions.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distributional Impact by Income Group</CardTitle>
                <CardDescription>How different scenarios affect various income levels (% of income)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    equal: { label: "Equal Burden", color: "hsl(var(--chart-1))" },
                    progressive: { label: "Progressive", color: "hsl(var(--chart-2))" },
                    broad: { label: "Broad Base", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { group: "Bottom 20%", equal: 0.8, progressive: 0.2, broad: 1.2 },
                        { group: "20-40%", equal: 1.4, progressive: 0.6, broad: 2.1 },
                        { group: "40-60%", equal: 2.1, progressive: 1.1, broad: 2.8 },
                        { group: "60-80%", equal: 2.8, progressive: 1.8, broad: 3.4 },
                        { group: "80-95%", equal: 3.2, progressive: 2.4, broad: 3.9 },
                        { group: "95-99%", equal: 4.1, progressive: 3.8, broad: 4.2 },
                        { group: "Top 1%", equal: 5.2, progressive: 8.9, broad: 4.8 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {formatPercent(entry.value as number)} of income
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="equal" fill="var(--color-equal)" />
                      <Bar dataKey="progressive" fill="var(--color-progressive)" />
                      <Bar dataKey="broad" fill="var(--color-broad)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Equal Burden Approach</CardTitle>
                  <CardDescription>Your preferred balanced strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900">Key Features</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Minimal income tax increases</li>
                        <li>• 2.5% VAT with food/medicine exempt</li>
                        <li>• Carbon tax with rebates</li>
                        <li>• Modest wealth tax (0.5%)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-900">Achieves Goals</h5>
                      <p className="text-sm text-green-700">
                        Minimizes income taxes (9.5% of total) while spreading burden across new tax bases.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progressive Focus</CardTitle>
                  <CardDescription>Protect lower/middle income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-900">Lower Impact</h5>
                      <p className="text-sm text-green-700">Bottom 60% see minimal increases. No regressive VAT.</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h5 className="font-medium text-red-900">High Risk</h5>
                      <p className="text-sm text-red-700">
                        Relies heavily on wealth tax and high earners. Constitutional challenges likely.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Broad Base Approach</CardTitle>
                  <CardDescription>Lower rates, wider participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-medium text-yellow-900">Stable Revenue</h5>
                      <p className="text-sm text-yellow-700">Broader base provides more reliable revenue stream.</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-900">Middle Class Hit</h5>
                      <p className="text-sm text-orange-700">
                        Higher burden on middle income groups. 3.5% VAT affects everyone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
