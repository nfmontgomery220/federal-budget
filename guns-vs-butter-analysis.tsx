"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Shield, Heart, Calculator, AlertTriangle } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Guns vs Butter analysis data
const gunsVsButterData = {
  2024: {
    totalDeficit: 1850,
    revenueGap: 1050, // After loopholes/enforcement

    // The "Big 4" - Politically Untouchable
    bigFour: {
      total: 3287,
      programs: [
        { name: "Social Security", amount: 1347, growth: 5.2, beneficiaries: 67000000, avgBenefit: 1907 },
        { name: "Medicare", amount: 1021, growth: 6.8, beneficiaries: 65000000, avgBenefit: 1571 },
        { name: "Medicaid", amount: 616, growth: 4.1, beneficiaries: 85000000, avgBenefit: 724 },
        { name: "Veterans Benefits", amount: 303, growth: 3.8, beneficiaries: 9000000, avgBenefit: 3367 },
      ],
    },

    // Defense - "Guns"
    defense: {
      total: 816,
      categories: [
        { name: "Personnel", amount: 312, cutPotential: 62, difficulty: "Medium", impact: "High" },
        { name: "Operations & Maintenance", amount: 304, cutPotential: 91, difficulty: "Medium", impact: "Medium" },
        { name: "Procurement", amount: 200, cutPotential: 80, difficulty: "Easy", impact: "Low" },
        { name: "R&D", amount: 140, cutPotential: 28, difficulty: "Hard", impact: "High" },
      ],
      maxRealisticCuts: 261, // About 32% - back to 2019 levels
    },

    // Discretionary Non-Defense - "Butter"
    discretionary: {
      total: 912,
      categories: [
        { name: "Education", amount: 80, cutPotential: 24, difficulty: "Hard", impact: "High" },
        { name: "Transportation", amount: 105, cutPotential: 32, difficulty: "Medium", impact: "Medium" },
        { name: "Health Research (NIH)", amount: 47, cutPotential: 14, difficulty: "Hard", impact: "High" },
        { name: "Housing Assistance", amount: 63, cutPotential: 19, difficulty: "Hard", impact: "High" },
        { name: "International Affairs", amount: 51, cutPotential: 20, difficulty: "Easy", impact: "Low" },
        { name: "Justice/Law Enforcement", amount: 61, cutPotential: 18, difficulty: "Medium", impact: "Medium" },
        { name: "Agriculture", amount: 26, cutPotential: 8, difficulty: "Easy", impact: "Low" },
        { name: "Energy", amount: 45, cutPotential: 18, difficulty: "Medium", impact: "Medium" },
        { name: "EPA", amount: 12, cutPotential: 4, difficulty: "Hard", impact: "High" },
        { name: "NASA", amount: 25, cutPotential: 8, difficulty: "Medium", impact: "Medium" },
        { name: "Other Agencies", amount: 397, cutPotential: 119, difficulty: "Medium", impact: "Medium" },
      ],
      maxRealisticCuts: 284, // About 31% cuts
    },

    // Other Mandatory - Limited Cut Potential
    otherMandatory: {
      total: 735,
      categories: [
        { name: "Interest on Debt", amount: 640, cutPotential: 0, difficulty: "Impossible", impact: "N/A" },
        { name: "Unemployment Insurance", amount: 35, cutPotential: 11, difficulty: "Medium", impact: "High" },
        { name: "Food Assistance (SNAP)", amount: 60, cutPotential: 18, difficulty: "Hard", impact: "High" },
      ],
      maxRealisticCuts: 29,
    },

    // Combination Scenarios
    scenarios: [
      {
        name: "Moderate Cuts + Progressive Taxes",
        description: "Balanced approach with modest cuts and higher taxes on wealthy",
        defensecuts: 130, // 16% cut
        discretionaryCuts: 142, // 15.6% cut
        mandatoryCuts: 15,
        totalCuts: 287,
        taxIncreases: 763,
        totalDeficitReduction: 1050,
        politicalDifficulty: "High",
        economicImpact: -1.1,
      },
      {
        name: "Deep Defense Cuts + Moderate Taxes",
        description: "Significant military reduction, moderate tax increases",
        defensecuts: 245, // 30% cut - back to 2015 levels
        discretionaryCuts: 91, // 10% cut
        mandatoryCuts: 15,
        totalCuts: 351,
        taxIncreases: 699,
        totalDeficitReduction: 1050,
        politicalDifficulty: "Very High",
        economicImpact: -0.9,
      },
      {
        name: "Austerity Approach",
        description: "Maximum realistic cuts across all areas",
        defensecuts: 261, // 32% cut
        discretionaryCuts: 284, // 31% cut
        mandatoryCuts: 29,
        totalCuts: 574,
        taxIncreases: 476,
        totalDeficitReduction: 1050,
        politicalDifficulty: "Extreme",
        economicImpact: -2.1,
      },
    ],
  },
}

const historicalGunsVsButter = [
  { year: 1970, defense: 8.1, social: 6.2, total: 19.3, defenseShare: 42.0 },
  { year: 1980, defense: 4.9, social: 11.1, total: 21.7, defenseShare: 22.6 },
  { year: 1990, defense: 5.2, social: 11.9, total: 21.9, defenseShare: 23.7 },
  { year: 2000, defense: 3.0, social: 10.5, total: 18.2, defenseShare: 16.5 },
  { year: 2010, defense: 4.7, social: 16.0, total: 23.8, defenseShare: 19.7 },
  { year: 2020, defense: 3.7, social: 17.8, total: 31.2, defenseShare: 11.9 },
  { year: 2024, defense: 2.9, social: 11.7, total: 23.9, defenseShare: 12.1 },
]

const internationalComparison = [
  { country: "United States", defense: 3.5, social: 18.7, total: 37.8 },
  { country: "Germany", defense: 1.4, social: 25.9, total: 43.9 },
  { country: "France", defense: 1.9, social: 31.2, total: 58.5 },
  { country: "United Kingdom", defense: 2.3, social: 20.6, total: 39.0 },
  { country: "Japan", defense: 1.0, social: 22.1, total: 38.4 },
  { country: "South Korea", defense: 2.8, social: 12.2, total: 28.4 },
]

interface GunsVsButterAnalysisProps {
  onBack?: () => void
}

export default function GunsVsButterAnalysis({ onBack }: GunsVsButterAnalysisProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedScenario, setSelectedScenario] = useState("Moderate Cuts + Progressive Taxes")
  const [customCuts, setCustomCuts] = useState({
    defense: 16, // percentage
    discretionary: 15,
    mandatory: 2,
  })

  const currentData = gunsVsButterData[selectedYear as keyof typeof gunsVsButterData]

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`
  const formatMillions = (amount: number) => `${amount.toLocaleString()}M`

  const calculateCustomCuts = () => {
    const defenseCut = (customCuts.defense / 100) * currentData.defense.total
    const discretionaryCut = (customCuts.discretionary / 100) * currentData.discretionary.total
    const mandatoryCut = (customCuts.mandatory / 100) * currentData.otherMandatory.total

    return {
      total: defenseCut + discretionaryCut + mandatoryCut,
      defense: defenseCut,
      discretionary: discretionaryCut,
      mandatory: mandatoryCut,
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-orange-100 text-orange-800"
      case "extreme":
        return "bg-red-100 text-red-800"
      case "very high":
        return "bg-red-100 text-red-800"
      case "impossible":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
                  Back to Tax Scenarios
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Guns vs Butter Analysis</h1>
            </div>
            <p className="text-gray-600">
              Classic economic trade-offs: Military spending vs Social programs. Finding the right balance to close the
              ${formatBillions(currentData.totalDeficit)} deficit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">FY 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* The Hard Reality */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              The 70s Economics Reality Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatBillions(currentData.bigFour.total)}</div>
                <div className="text-sm text-blue-700">Big 4 (Untouchable)</div>
                <div className="text-xs text-gray-600">SS, Medicare, Medicaid, Vets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{formatBillions(currentData.defense.total)}</div>
                <div className="text-sm text-red-700">Defense (Guns)</div>
                <div className="text-xs text-gray-600">
                  Max cut: ~{formatBillions(currentData.defense.maxRealisticCuts)}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatBillions(currentData.discretionary.total)}
                </div>
                <div className="text-sm text-green-700">Discretionary (Butter)</div>
                <div className="text-xs text-gray-600">
                  Max cut: ~{formatBillions(currentData.discretionary.maxRealisticCuts)}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{formatBillions(640)}</div>
                <div className="text-sm text-gray-700">Interest (Untouchable)</div>
                <div className="text-xs text-gray-600">Can't cut debt service</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatBillions(574)}</div>
                <div className="text-sm text-orange-700">Max Possible Cuts</div>
                <div className="text-xs text-gray-600">
                  Still need {formatBillions(currentData.revenueGap - 574)} in taxes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Current Balance</TabsTrigger>
            <TabsTrigger value="scenarios">Cut Scenarios</TabsTrigger>
            <TabsTrigger value="calculator">Custom Calculator</TabsTrigger>
            <TabsTrigger value="historical">Historical Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Guns vs Butter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Defense Spending Breakdown
                  </CardTitle>
                  <CardDescription>
                    Total: {formatBillions(currentData.defense.total)} (12.1% of budget)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.defense.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <div className="text-right">
                            <div className="font-bold">{formatBillions(category.amount)}</div>
                            <div className="text-xs text-gray-600">
                              Cut potential: {formatBillions(category.cutPotential)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(category.difficulty)} size="sm">
                            {category.difficulty}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {category.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-600" />
                    Social/Discretionary Spending
                  </CardTitle>
                  <CardDescription>
                    Total: {formatBillions(currentData.discretionary.total)} (13.5% of budget)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {currentData.discretionary.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{category.name}</span>
                          <div className="text-right">
                            <div className="font-bold text-sm">{formatBillions(category.amount)}</div>
                            <div className="text-xs text-gray-600">Cut: {formatBillions(category.cutPotential)}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(category.difficulty)} size="sm">
                            {category.difficulty}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {category.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* The Big 4 - Untouchable */}
            <Card>
              <CardHeader>
                <CardTitle>The "Big 4" - Politically Untouchable Programs</CardTitle>
                <CardDescription>
                  {formatBillions(currentData.bigFour.total)} (48.7% of budget) - These programs are essentially
                  off-limits for cuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentData.bigFour.programs.map((program, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">{program.name}</h4>
                      <div className="text-2xl font-bold text-blue-600">{formatBillions(program.amount)}</div>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>{formatMillions(program.beneficiaries)} beneficiaries</div>
                        <div>Avg: ${formatMillions(program.avgBenefit)}/year</div>
                        <div>Growth: {formatPercent(program.growth)}/year</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-red-600">{formatBillions(scenario.totalCuts)}</div>
                          <div className="text-xs text-gray-600">Spending Cuts</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-600">
                            {formatBillions(scenario.taxIncreases)}
                          </div>
                          <div className="text-xs text-gray-600">Tax Increases</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Defense Cuts:</span>
                          <span className="font-medium">
                            {formatBillions(scenario.defensecuts || scenario.defensecuts)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Discretionary Cuts:</span>
                          <span className="font-medium">{formatBillions(scenario.discretionaryCuts)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Other Cuts:</span>
                          <span className="font-medium">{formatBillions(scenario.mandatoryCuts)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Badge className={getDifficultyColor(scenario.politicalDifficulty)} size="sm">
                          {scenario.politicalDifficulty}
                        </Badge>
                        <div className="text-xs text-center">
                          <div className="font-medium">GDP Impact</div>
                          <div className="text-red-600">{formatPercent(scenario.economicImpact)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Scenario Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedScenario} - Detailed Impact</CardTitle>
                <CardDescription>What this scenario means in practice</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scenario = currentData.scenarios.find((s) => s.name === selectedScenario)
                  if (!scenario) return null

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Spending Cuts Impact</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-900">
                              Defense Cuts: {formatBillions(scenario.defensecuts || scenario.defensecuts)}
                            </h5>
                            <p className="text-sm text-red-700">
                              {scenario.name.includes("Deep Defense")
                                ? "Return to 2015 spending levels. Significant force reduction, base closures, equipment delays."
                                : "Modest personnel reduction, delayed procurement, efficiency improvements."}
                            </p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <h5 className="font-medium text-orange-900">
                              Discretionary Cuts: {formatBillions(scenario.discretionaryCuts)}
                            </h5>
                            <p className="text-sm text-orange-700">
                              {scenario.name.includes("Austerity")
                                ? "Deep cuts to education, research, infrastructure. Significant program eliminations."
                                : "Targeted efficiency improvements, some program consolidation."}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Economic & Political Reality</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-yellow-900">Political Feasibility</h5>
                            <p className="text-sm text-yellow-700">
                              {scenario.politicalDifficulty === "Extreme"
                                ? "Requires unprecedented political consensus. Multiple election cycles needed."
                                : scenario.politicalDifficulty === "Very High"
                                  ? "Extremely difficult. Would face massive opposition from defense/social constituencies."
                                  : "Challenging but potentially achievable with strong leadership and crisis motivation."}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900">Economic Impact</h5>
                            <p className="text-sm text-blue-700">
                              GDP impact of {formatPercent(scenario.economicImpact)} reflects reduced government
                              spending multiplier effects and potential tax drag on growth.
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

          <TabsContent value="calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Custom Spending Cut Calculator
                </CardTitle>
                <CardDescription>Adjust spending cuts to see deficit impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Defense Cuts: {customCuts.defense}% (Max realistic: 32%)
                      </label>
                      <Slider
                        value={[customCuts.defense]}
                        onValueChange={(value) => setCustomCuts({ ...customCuts, defense: value[0] })}
                        max={32}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Cut: {formatBillions((customCuts.defense / 100) * currentData.defense.total)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Discretionary Cuts: {customCuts.discretionary}% (Max realistic: 31%)
                      </label>
                      <Slider
                        value={[customCuts.discretionary]}
                        onValueChange={(value) => setCustomCuts({ ...customCuts, discretionary: value[0] })}
                        max={31}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Cut: {formatBillions((customCuts.discretionary / 100) * currentData.discretionary.total)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Other Mandatory Cuts: {customCuts.mandatory}% (Max realistic: 4%)
                      </label>
                      <Slider
                        value={[customCuts.mandatory]}
                        onValueChange={(value) => setCustomCuts({ ...customCuts, mandatory: value[0] })}
                        max={4}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        Cut: {formatBillions((customCuts.mandatory / 100) * currentData.otherMandatory.total)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900">Total Spending Cuts</h4>
                      <div className="text-2xl font-bold text-red-600">
                        {formatBillions(calculateCustomCuts().total)}
                      </div>
                      <p className="text-sm text-red-700">Annual budget reduction</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Remaining Tax Need</h4>
                      <div className="text-2xl font-bold text-green-600">
                        {formatBillions(Math.max(0, currentData.revenueGap - calculateCustomCuts().total))}
                      </div>
                      <p className="text-sm text-green-700">Still needed from tax increases</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Deficit Closure</h4>
                      <div className="text-xl font-bold text-blue-600">
                        {formatPercent((calculateCustomCuts().total / currentData.revenueGap) * 100)}
                      </div>
                      <p className="text-sm text-blue-700">Of remaining gap closed by cuts</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Reality Check</h4>
                      <p className="text-sm text-yellow-700">
                        {calculateCustomCuts().total > 400
                          ? "These cuts would be extremely difficult politically and economically disruptive."
                          : calculateCustomCuts().total > 200
                            ? "Significant cuts requiring major political consensus."
                            : "Modest cuts that might be politically feasible."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Guns vs Butter (% of GDP)</CardTitle>
                  <CardDescription>Defense vs Social spending over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      defense: { label: "Defense", color: "hsl(var(--chart-1))" },
                      social: { label: "Social", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalGunsVsButter}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.name}: {formatPercent(entry.value as number)} of GDP
                                    </p>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="defense" stroke="var(--color-defense)" strokeWidth={3} />
                        <Line type="monotone" dataKey="social" stroke="var(--color-social)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>International Comparison (% of GDP)</CardTitle>
                  <CardDescription>How the US compares to other developed nations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      defense: { label: "Defense", color: "hsl(var(--chart-1))" },
                      social: { label: "Social", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={internationalComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="defense" name="Defense Spending" />
                        <YAxis dataKey="social" name="Social Spending" />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{data.country}</p>
                                  <p className="text-sm">Defense: {formatPercent(data.defense)} of GDP</p>
                                  <p className="text-sm">Social: {formatPercent(data.social)} of GDP</p>
                                  <p className="text-sm">Total Gov: {formatPercent(data.total)} of GDP</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Scatter dataKey="social" fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Historical Insights</CardTitle>
                <CardDescription>Lessons from 50+ years of budget battles</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Cold War Peak (1970s-80s)</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Defense spending peaked at 8.1% of GDP in 1970, gradually declining as social programs expanded. The
                    classic guns vs butter trade-off.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Peace Dividend (1990s-2000s)</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Post-Cold War defense cuts freed up resources for deficit reduction and social programs. Defense
                    fell to 3% of GDP by 2000.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Modern Challenge (2010s-2020s)</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Aging population drives social spending growth while geopolitical tensions limit defense cuts. The
                    squeeze is real.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
