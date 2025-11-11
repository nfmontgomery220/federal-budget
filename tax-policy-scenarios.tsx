"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Target, BarChart3, Zap } from "lucide-react"

interface TaxScenario {
  id: string
  name: string
  description: string
  changes: {
    individualRates: number[]
    corporateRate: number
    capitalGainsRate: number
    estateRate: number
  }
  projectedRevenue: number
  economicImpact: {
    gdpEffect: number
    employmentEffect: number
    investmentEffect: number
  }
  politicalDifficulty: "Low" | "Medium" | "High" | "Extreme"
  timeToImplement: string
}

const taxScenarios: TaxScenario[] = [
  {
    id: "current",
    name: "Current Tax System (2025)",
    description: "Existing tax rates after recent legislation",
    changes: {
      individualRates: [10, 12, 22, 24, 32, 35, 37],
      corporateRate: 21,
      capitalGainsRate: 20,
      estateRate: 40,
    },
    projectedRevenue: 4550,
    economicImpact: {
      gdpEffect: 0,
      employmentEffect: 0,
      investmentEffect: 0,
    },
    politicalDifficulty: "Low",
    timeToImplement: "Current",
  },
  {
    id: "progressive",
    name: "Progressive Tax Reform",
    description: "Higher rates on wealthy individuals and corporations",
    changes: {
      individualRates: [10, 12, 22, 28, 36, 42, 45],
      corporateRate: 28,
      capitalGainsRate: 28,
      estateRate: 55,
    },
    projectedRevenue: 5420,
    economicImpact: {
      gdpEffect: -1.2,
      employmentEffect: -0.8,
      investmentEffect: -2.1,
    },
    politicalDifficulty: "High",
    timeToImplement: "2-3 years",
  },
  {
    id: "flat",
    name: "Flat Tax System",
    description: "Single rate for all income levels with simplified deductions",
    changes: {
      individualRates: [20, 20, 20, 20, 20, 20, 20],
      corporateRate: 20,
      capitalGainsRate: 20,
      estateRate: 20,
    },
    projectedRevenue: 4180,
    economicImpact: {
      gdpEffect: 1.8,
      employmentEffect: 1.2,
      investmentEffect: 2.5,
    },
    politicalDifficulty: "Extreme",
    timeToImplement: "5+ years",
  },
  {
    id: "moderate",
    name: "Moderate Reform",
    description: "Balanced approach with modest increases on higher earners",
    changes: {
      individualRates: [10, 12, 22, 26, 34, 37, 39],
      corporateRate: 25,
      capitalGainsRate: 23,
      estateRate: 45,
    },
    projectedRevenue: 4890,
    economicImpact: {
      gdpEffect: -0.4,
      employmentEffect: -0.2,
      investmentEffect: -0.8,
    },
    politicalDifficulty: "Medium",
    timeToImplement: "1-2 years",
  },
  {
    id: "supply-side",
    name: "Supply-Side Cuts",
    description: "Lower rates to stimulate economic growth",
    changes: {
      individualRates: [8, 10, 18, 20, 28, 30, 32],
      corporateRate: 15,
      capitalGainsRate: 15,
      estateRate: 30,
    },
    projectedRevenue: 3890,
    economicImpact: {
      gdpEffect: 2.4,
      employmentEffect: 1.8,
      investmentEffect: 3.2,
    },
    politicalDifficulty: "High",
    timeToImplement: "1-2 years",
  },
]

export default function TaxPolicyScenarios() {
  const [selectedScenario, setSelectedScenario] = useState("current")
  const [comparisonScenario, setComparisonScenario] = useState("progressive")
  const [customRates, setCustomRates] = useState({
    individualRates: [10, 12, 22, 24, 32, 35, 37],
    corporateRate: 21,
    capitalGainsRate: 20,
    estateRate: 40,
  })

  const currentScenario = taxScenarios.find((s) => s.id === selectedScenario) || taxScenarios[0]
  const compareScenario = taxScenarios.find((s) => s.id === comparisonScenario) || taxScenarios[1]

  const calculateCustomRevenue = () => {
    // Simplified revenue calculation based on rate changes
    const baseRevenue = 4550
    const individualChange = (customRates.individualRates.reduce((a, b) => a + b, 0) / 7 - 24.6) / 24.6
    const corporateChange = (customRates.corporateRate - 21) / 21
    const capitalGainsChange = (customRates.capitalGainsRate - 20) / 20

    return baseRevenue * (1 + individualChange * 0.6 + corporateChange * 0.15 + capitalGainsChange * 0.05)
  }

  const customRevenue = calculateCustomRevenue()
  const revenueChange = customRevenue - 4550
  const deficitImpact = 2650 - revenueChange // Current deficit minus revenue change

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Policy Scenarios</h1>
        <p className="text-gray-600">
          Compare different tax policy approaches and their economic and political implications
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {taxScenarios.map((scenario) => (
          <Button
            key={scenario.id}
            variant={selectedScenario === scenario.id ? "default" : "outline"}
            onClick={() => setSelectedScenario(scenario.id)}
            className="h-auto p-3 text-left"
          >
            <div>
              <div className="font-medium text-sm">{scenario.name}</div>
              <div className="text-xs opacity-75">${(scenario.projectedRevenue / 1000).toFixed(1)}T</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="custom">Custom Design</TabsTrigger>
          <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentScenario.name}
                  </CardTitle>
                  <CardDescription>{currentScenario.description}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    currentScenario.politicalDifficulty === "Low"
                      ? "border-green-300 text-green-700"
                      : currentScenario.politicalDifficulty === "Medium"
                        ? "border-yellow-300 text-yellow-700"
                        : currentScenario.politicalDifficulty === "High"
                          ? "border-orange-300 text-orange-700"
                          : "border-red-300 text-red-700"
                  }
                >
                  {currentScenario.politicalDifficulty} Difficulty
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Revenue Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Projected Revenue:</span>
                      <span className="font-mono">${(currentScenario.projectedRevenue / 1000).toFixed(1)}T</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Change from Current:</span>
                      <span
                        className={`font-mono ${currentScenario.projectedRevenue > 4550 ? "text-green-600" : "text-red-600"}`}
                      >
                        {currentScenario.projectedRevenue > 4550 ? "+" : ""}$
                        {((currentScenario.projectedRevenue - 4550) / 1000).toFixed(1)}T
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Deficit Impact:</span>
                      <span
                        className={`font-mono ${currentScenario.projectedRevenue > 4550 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${((2650 - (currentScenario.projectedRevenue - 4550)) / 1000).toFixed(1)}T
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Tax Rates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Top Individual Rate:</span>
                      <span className="font-mono">{currentScenario.changes.individualRates[6]}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Corporate Rate:</span>
                      <span className="font-mono">{currentScenario.changes.corporateRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Capital Gains Rate:</span>
                      <span className="font-mono">{currentScenario.changes.capitalGainsRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estate Tax Rate:</span>
                      <span className="font-mono">{currentScenario.changes.estateRate}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Economic Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">GDP Effect:</span>
                      <span
                        className={`font-mono ${currentScenario.economicImpact.gdpEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {currentScenario.economicImpact.gdpEffect >= 0 ? "+" : ""}
                        {currentScenario.economicImpact.gdpEffect}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employment Effect:</span>
                      <span
                        className={`font-mono ${currentScenario.economicImpact.employmentEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {currentScenario.economicImpact.employmentEffect >= 0 ? "+" : ""}
                        {currentScenario.economicImpact.employmentEffect}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Investment Effect:</span>
                      <span
                        className={`font-mono ${currentScenario.economicImpact.investmentEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {currentScenario.economicImpact.investmentEffect >= 0 ? "+" : ""}
                        {currentScenario.economicImpact.investmentEffect}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Implementation:</span>
                      <span className="font-mono text-gray-600">{currentScenario.timeToImplement}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Tax Brackets Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Tax Brackets</CardTitle>
              <CardDescription>Tax rates by income level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentScenario.changes.individualRates.map((rate, index) => {
                  const brackets = [
                    "$0 - $11,000",
                    "$11,001 - $44,725",
                    "$44,726 - $95,375",
                    "$95,376 - $182,050",
                    "$182,051 - $231,250",
                    "$231,251 - $578,125",
                    "Over $578,125",
                  ]

                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{brackets[index]}</span>
                      <div className="flex items-center gap-4">
                        <Progress value={(rate / 50) * 100} className="w-24 h-2" />
                        <span className="font-mono w-12 text-right">{rate}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Compare Scenario:</label>
              <select
                value={comparisonScenario}
                onChange={(e) => setComparisonScenario(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {taxScenarios
                  .filter((s) => s.id !== selectedScenario)
                  .map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">{currentScenario.name}</CardTitle>
                <CardDescription>{currentScenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-800">
                        ${(currentScenario.projectedRevenue / 1000).toFixed(1)}T
                      </div>
                      <div className="text-sm text-blue-600">Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${currentScenario.economicImpact.gdpEffect >= 0 ? "text-green-800" : "text-red-800"}`}
                      >
                        {currentScenario.economicImpact.gdpEffect >= 0 ? "+" : ""}
                        {currentScenario.economicImpact.gdpEffect}%
                      </div>
                      <div className="text-sm text-blue-600">GDP Impact</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Top Individual Rate:</span>
                      <span className="font-mono">{currentScenario.changes.individualRates[6]}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Corporate Rate:</span>
                      <span className="font-mono">{currentScenario.changes.corporateRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Political Difficulty:</span>
                      <Badge variant="outline">{currentScenario.politicalDifficulty}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-900">{compareScenario.name}</CardTitle>
                <CardDescription>{compareScenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">
                        ${(compareScenario.projectedRevenue / 1000).toFixed(1)}T
                      </div>
                      <div className="text-sm text-green-600">Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${compareScenario.economicImpact.gdpEffect >= 0 ? "text-green-800" : "text-red-800"}`}
                      >
                        {compareScenario.economicImpact.gdpEffect >= 0 ? "+" : ""}
                        {compareScenario.economicImpact.gdpEffect}%
                      </div>
                      <div className="text-sm text-green-600">GDP Impact</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Top Individual Rate:</span>
                      <span className="font-mono">{compareScenario.changes.individualRates[6]}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Corporate Rate:</span>
                      <span className="font-mono">{compareScenario.changes.corporateRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Political Difficulty:</span>
                      <Badge variant="outline">{compareScenario.politicalDifficulty}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Revenue Difference</h4>
                  <div
                    className={`text-2xl font-bold ${compareScenario.projectedRevenue > currentScenario.projectedRevenue ? "text-green-600" : "text-red-600"}`}
                  >
                    {compareScenario.projectedRevenue > currentScenario.projectedRevenue ? "+" : ""}$
                    {((compareScenario.projectedRevenue - currentScenario.projectedRevenue) / 1000).toFixed(1)}T
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">GDP Impact Difference</h4>
                  <div
                    className={`text-2xl font-bold ${compareScenario.economicImpact.gdpEffect > currentScenario.economicImpact.gdpEffect ? "text-green-600" : "text-red-600"}`}
                  >
                    {compareScenario.economicImpact.gdpEffect > currentScenario.economicImpact.gdpEffect ? "+" : ""}
                    {(compareScenario.economicImpact.gdpEffect - currentScenario.economicImpact.gdpEffect).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Rate Difference</h4>
                  <div className="text-2xl font-bold text-gray-800">
                    {compareScenario.changes.individualRates[6] - currentScenario.changes.individualRates[6] > 0
                      ? "+"
                      : ""}
                    {compareScenario.changes.individualRates[6] - currentScenario.changes.individualRates[6]}%
                  </div>
                  <div className="text-sm text-gray-600">Top bracket</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Your Own Tax Policy</CardTitle>
              <CardDescription>Adjust tax rates to see the projected impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Individual Tax Brackets */}
                <div>
                  <h4 className="font-medium mb-4">Individual Tax Brackets</h4>
                  <div className="space-y-4">
                    {customRates.individualRates.map((rate, index) => {
                      const brackets = [
                        "$0 - $11,000",
                        "$11,001 - $44,725",
                        "$44,726 - $95,375",
                        "$95,376 - $182,050",
                        "$182,051 - $231,250",
                        "$231,251 - $578,125",
                        "Over $578,125",
                      ]

                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium w-48">{brackets[index]}</span>
                          <div className="flex items-center gap-4 flex-1">
                            <Slider
                              value={[rate]}
                              onValueChange={(value) => {
                                const newRates = [...customRates.individualRates]
                                newRates[index] = value[0]
                                setCustomRates({ ...customRates, individualRates: newRates })
                              }}
                              min={0}
                              max={50}
                              step={0.5}
                              className="flex-1"
                            />
                            <span className="font-mono w-12 text-right">{rate}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Other Tax Rates */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Corporate Tax Rate</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[customRates.corporateRate]}
                        onValueChange={(value) => setCustomRates({ ...customRates, corporateRate: value[0] })}
                        min={10}
                        max={40}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{customRates.corporateRate}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Capital Gains Rate</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[customRates.capitalGainsRate]}
                        onValueChange={(value) => setCustomRates({ ...customRates, capitalGainsRate: value[0] })}
                        min={0}
                        max={40}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{customRates.capitalGainsRate}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Estate Tax Rate</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[customRates.estateRate]}
                        onValueChange={(value) => setCustomRates({ ...customRates, estateRate: value[0] })}
                        min={0}
                        max={60}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{customRates.estateRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Results */}
          <Card>
            <CardHeader>
              <CardTitle>Your Custom Tax Policy Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">${(customRevenue / 1000).toFixed(1)}T</div>
                  <div className="text-sm text-blue-600">Projected Revenue</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className={`text-2xl font-bold ${revenueChange >= 0 ? "text-green-800" : "text-red-800"}`}>
                    {revenueChange >= 0 ? "+" : ""}${(revenueChange / 1000).toFixed(1)}T
                  </div>
                  <div className="text-sm text-green-600">Revenue Change</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">${(deficitImpact / 1000).toFixed(1)}T</div>
                  <div className="text-sm text-purple-600">Remaining Deficit</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-800">
                    {((Math.abs(revenueChange) / 2650) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-orange-600">Deficit Impact</div>
                </div>
              </div>

              {Math.abs(revenueChange) > 100 && (
                <Alert
                  className={revenueChange > 0 ? "border-green-200 bg-green-50 mt-4" : "border-red-200 bg-red-50 mt-4"}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Impact Analysis:</strong>
                    {revenueChange > 0 ? (
                      <span className="text-green-800">
                        Your tax policy would increase federal revenue by ${(Math.abs(revenueChange) / 1000).toFixed(1)}
                        T annually, reducing the deficit by {((Math.abs(revenueChange) / 2650) * 100).toFixed(1)}%.
                      </span>
                    ) : (
                      <span className="text-red-800">
                        Your tax policy would decrease federal revenue by ${(Math.abs(revenueChange) / 1000).toFixed(1)}
                        T annually, increasing the deficit by {((Math.abs(revenueChange) / 2650) * 100).toFixed(1)}%.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-600">
                          {scenario.id === "current"
                            ? "Baseline"
                            : scenario.projectedRevenue > 4550
                              ? `+${((scenario.projectedRevenue - 4550) / 1000).toFixed(1)}T`
                              : `${((scenario.projectedRevenue - 4550) / 1000).toFixed(1)}T`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">${(scenario.projectedRevenue / 1000).toFixed(1)}T</div>
                        <Progress value={(scenario.projectedRevenue / 6000) * 100} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Economic Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxScenarios.map((scenario) => (
                    <div key={scenario.id} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{scenario.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">GDP</div>
                          <div
                            className={`font-mono ${scenario.economicImpact.gdpEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {scenario.economicImpact.gdpEffect >= 0 ? "+" : ""}
                            {scenario.economicImpact.gdpEffect}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Jobs</div>
                          <div
                            className={`font-mono ${scenario.economicImpact.employmentEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {scenario.economicImpact.employmentEffect >= 0 ? "+" : ""}
                            {scenario.economicImpact.employmentEffect}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Investment</div>
                          <div
                            className={`font-mono ${scenario.economicImpact.investmentEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {scenario.economicImpact.investmentEffect >= 0 ? "+" : ""}
                            {scenario.economicImpact.investmentEffect}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Feasibility</CardTitle>
              <CardDescription>Political difficulty and timeline for each scenario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={
                          scenario.politicalDifficulty === "Low"
                            ? "border-green-300 text-green-700"
                            : scenario.politicalDifficulty === "Medium"
                              ? "border-yellow-300 text-yellow-700"
                              : scenario.politicalDifficulty === "High"
                                ? "border-orange-300 text-orange-700"
                                : "border-red-300 text-red-700"
                        }
                      >
                        {scenario.politicalDifficulty}
                      </Badge>
                      <span className="text-sm text-gray-600 w-20">{scenario.timeToImplement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
