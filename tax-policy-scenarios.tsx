"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, AlertTriangle, Download, Calculator } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Tax policy scenarios data
const taxPolicyData = {
  2024: {
    remainingGap: 1050, // After loopholes and enforcement
    currentRates: {
      individual: {
        brackets: [
          { min: 0, max: 11000, rate: 10, revenue: 89 },
          { min: 11000, max: 44725, rate: 12, revenue: 234 },
          { min: 44725, max: 95375, rate: 22, revenue: 456 },
          { min: 95375, max: 182050, rate: 24, revenue: 389 },
          { min: 182050, max: 231250, rate: 32, revenue: 267 },
          { min: 231250, max: 578125, rate: 35, revenue: 334 },
          { min: 578125, max: Number.POSITIVE_INFINITY, rate: 37, revenue: 273 },
        ],
        totalRevenue: 2042,
      },
      corporate: {
        rate: 21,
        revenue: 420,
      },
      capitalGains: {
        rate: 20, // Top rate
        revenue: 163,
      },
    },
    scenarios: [
      {
        name: "Progressive Approach",
        description: "Focus on high earners and corporations",
        totalRevenue: 1089,
        economicImpact: -0.8,
        politicalDifficulty: "High",
        changes: [
          { type: "Individual", description: "New 45% bracket >$400K", revenue: 234 },
          { type: "Individual", description: "New 50% bracket >$1M", revenue: 156 },
          { type: "Corporate", description: "Raise to 28%", revenue: 134 },
          { type: "Capital Gains", description: "Treat as ordinary income >$1M", revenue: 89 },
          { type: "Wealth Tax", description: "2% on net worth >$50M", revenue: 267 },
          { type: "Financial Transaction", description: "0.1% on trades", revenue: 89 },
          { type: "Carbon Tax", description: "$50/ton CO2", revenue: 120 },
        ],
      },
      {
        name: "Broad-Based Approach",
        description: "Moderate increases across income levels",
        totalRevenue: 1034,
        economicImpact: -1.2,
        politicalDifficulty: "Very High",
        changes: [
          { type: "Individual", description: "Raise all brackets by 3-5%", revenue: 456 },
          { type: "Corporate", description: "Raise to 25%", revenue: 89 },
          { type: "Payroll", description: "Remove SS cap, add 2% Medicare", revenue: 234 },
          { type: "VAT", description: "5% Value Added Tax", revenue: 255 },
        ],
      },
      {
        name: "Innovation Approach",
        description: "New tax bases and modern economy",
        totalRevenue: 967,
        economicImpact: -0.5,
        politicalDifficulty: "Medium",
        changes: [
          { type: "Digital Services", description: "7% on tech giants", revenue: 89 },
          { type: "Robot Tax", description: "Tax on automation", revenue: 45 },
          { type: "Land Value", description: "Tax on land appreciation", revenue: 134 },
          { type: "Financial Transaction", description: "0.05% on all trades", revenue: 67 },
          { type: "Carbon Border", description: "Adjust for imports", revenue: 34 },
          { type: "Wealth Tax", description: "1% on net worth >$10M", revenue: 178 },
          { type: "Individual", description: "New 42% bracket >$500K", revenue: 234 },
          { type: "Corporate", description: "Minimum 15% effective rate", revenue: 186 },
        ],
      },
    ],
    behavioralEffects: {
      elasticities: {
        highIncome: -0.4, // 10% tax increase = 4% income reduction
        corporate: -0.25,
        capitalGains: -0.8,
        consumption: -0.15,
      },
      avoidanceRates: {
        individual: 0.15, // 15% of theoretical revenue lost to avoidance
        corporate: 0.25,
        wealth: 0.35,
        financial: 0.05,
      },
    },
    distributionalImpact: [
      { percentile: "Bottom 20%", currentShare: 2.3, newShare: 1.8, impact: 0.2 },
      { percentile: "20-40%", currentShare: 8.4, newShare: 7.9, impact: 0.8 },
      { percentile: "40-60%", currentShare: 14.1, newShare: 13.2, impact: 1.4 },
      { percentile: "60-80%", currentShare: 22.2, newShare: 21.1, impact: 2.8 },
      { percentile: "80-95%", currentShare: 28.6, newShare: 27.8, impact: 4.2 },
      { percentile: "95-99%", currentShare: 16.5, newShare: 18.9, impact: 8.9 },
      { percentile: "Top 1%", currentShare: 7.9, newShare: 9.3, impact: 12.4 },
    ],
  },
}

const revenueProjections = [
  { year: 2025, baseline: 4900, progressive: 5989, broadBased: 5934, innovation: 5867 },
  { year: 2026, baseline: 5145, progressive: 6234, broadBased: 6156, innovation: 6089 },
  { year: 2027, baseline: 5401, progressive: 6489, broadBased: 6387, innovation: 6321 },
  { year: 2028, baseline: 5671, progressive: 6756, broadBased: 6628, innovation: 6563 },
  { year: 2029, baseline: 5955, progressive: 7035, broadBased: 6881, innovation: 6816 },
]

const economicImpacts = [
  { scenario: "Progressive", gdpImpact: -0.8, employmentImpact: -0.3, investmentImpact: -1.2 },
  { scenario: "Broad-Based", gdpImpact: -1.2, employmentImpact: -0.8, investmentImpact: -1.8 },
  { scenario: "Innovation", gdpImpact: -0.5, employmentImpact: -0.1, investmentImpact: -0.7 },
]

interface TaxPolicyScenariosProps {
  onBack?: () => void
}

export default function TaxPolicyScenarios({ onBack }: TaxPolicyScenariosProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [activeTab, setActiveTab] = useState("scenarios")
  const [selectedScenario, setSelectedScenario] = useState("Progressive Approach")
  const [customRates, setCustomRates] = useState({
    topIndividual: 37,
    corporate: 21,
    capitalGains: 20,
    wealthTax: 0,
  })

  const currentData = taxPolicyData[selectedYear as keyof typeof taxPolicyData]

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const calculateCustomRevenue = () => {
    const individualIncrease = ((customRates.topIndividual - 37) / 37) * 273 * 0.6 // With behavioral effects
    const corporateIncrease = ((customRates.corporate - 21) / 21) * 420 * 0.75 // With behavioral effects
    const capitalGainsIncrease = ((customRates.capitalGains - 20) / 20) * 163 * 0.2 // High elasticity
    const wealthTaxRevenue = customRates.wealthTax * 89 // Rough estimate per percentage point

    return Math.max(0, individualIncrease + corporateIncrease + capitalGainsIncrease + wealthTaxRevenue)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "very high":
        return "bg-red-100 text-red-800"
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
                  Back to Optimization
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Tax Policy Scenarios</h1>
            </div>
            <p className="text-gray-600">
              Modeling tax increases to close the remaining ${formatBillions(currentData.remainingGap)} deficit gap
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>

        {/* Key Challenge */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              The Tax Increase Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{formatBillions(1850)}</div>
                <div className="text-sm text-red-700">Total Deficit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatBillions(400)}</div>
                <div className="text-sm text-orange-700">Loophole Closure</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{formatBillions(400)}</div>
                <div className="text-sm text-yellow-700">Enhanced Enforcement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{formatBillions(currentData.remainingGap)}</div>
                <div className="text-sm text-red-700">Remaining Gap</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scenarios">Policy Scenarios</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
            <TabsTrigger value="impacts">Economic Impact</TabsTrigger>
            <TabsTrigger value="distribution">Who Pays</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentData.scenarios.map((scenario, index) => (
                <Card key={index} className={selectedScenario === scenario.name ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {scenario.name}
                      <Button
                        variant={selectedScenario === scenario.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedScenario(scenario.name)}
                      >
                        Select
                      </Button>
                    </CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{formatBillions(scenario.totalRevenue)}</div>
                        <div className="text-sm text-gray-600">Additional Revenue</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-red-600">{formatPercent(scenario.economicImpact)}</div>
                          <div className="text-xs text-gray-600">GDP Impact</div>
                        </div>
                        <div>
                          <Badge className={getDifficultyColor(scenario.politicalDifficulty)}>
                            {scenario.politicalDifficulty}
                          </Badge>
                          <div className="text-xs text-gray-600 mt-1">Political Risk</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Key Changes:</h4>
                        <div className="space-y-1 text-sm">
                          {scenario.changes.slice(0, 4).map((change, changeIndex) => (
                            <div key={changeIndex} className="flex justify-between">
                              <span className="text-gray-600">{change.description}</span>
                              <span className="font-medium">{formatBillions(change.revenue)}</span>
                            </div>
                          ))}
                          {scenario.changes.length > 4 && (
                            <div className="text-xs text-gray-500">+{scenario.changes.length - 4} more changes...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Scenario Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedScenario} - Detailed Analysis</CardTitle>
                <CardDescription>Complete breakdown of tax changes and revenue projections</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scenario = currentData.scenarios.find((s) => s.name === selectedScenario)
                  if (!scenario) return null

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Tax Changes</h4>
                        <div className="space-y-3">
                          {scenario.changes.map((change, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{change.description}</div>
                                <div className="text-xs text-gray-600">{change.type}</div>
                              </div>
                              <div className="font-bold text-green-600">{formatBillions(change.revenue)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Implementation Considerations</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900">Revenue Reliability</h5>
                            <p className="text-sm text-blue-700">
                              {scenario.name === "Progressive Approach" &&
                                "High reliability from wealthy taxpayers, but subject to behavioral responses"}
                              {scenario.name === "Broad-Based Approach" &&
                                "Very reliable revenue base, but significant middle-class impact"}
                              {scenario.name === "Innovation Approach" &&
                                "Moderate reliability, depends on new tax base development"}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-yellow-900">Economic Effects</h5>
                            <p className="text-sm text-yellow-700">
                              GDP impact: {formatPercent(scenario.economicImpact)} due to reduced consumption and
                              investment
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-900">Political Challenges</h5>
                            <p className="text-sm text-red-700">
                              {scenario.politicalDifficulty} difficulty - requires significant legislative coalition
                              building
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
                  Custom Tax Rate Calculator
                </CardTitle>
                <CardDescription>Adjust tax rates to see revenue impact (includes behavioral effects)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Top Individual Rate: {customRates.topIndividual}% (Current: 37%)
                      </label>
                      <Slider
                        value={[customRates.topIndividual]}
                        onValueChange={(value) => setCustomRates({ ...customRates, topIndividual: value[0] })}
                        max={60}
                        min={30}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Corporate Rate: {customRates.corporate}% (Current: 21%)
                      </label>
                      <Slider
                        value={[customRates.corporate]}
                        onValueChange={(value) => setCustomRates({ ...customRates, corporate: value[0] })}
                        max={35}
                        min={15}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Capital Gains Rate: {customRates.capitalGains}% (Current: 20%)
                      </label>
                      <Slider
                        value={[customRates.capitalGains]}
                        onValueChange={(value) => setCustomRates({ ...customRates, capitalGains: value[0] })}
                        max={40}
                        min={15}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Wealth Tax Rate: {customRates.wealthTax}% (Current: 0%)
                      </label>
                      <Slider
                        value={[customRates.wealthTax]}
                        onValueChange={(value) => setCustomRates({ ...customRates, wealthTax: value[0] })}
                        max={5}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Revenue Impact</h4>
                      <div className="text-2xl font-bold text-green-600">
                        {formatBillions(calculateCustomRevenue())}
                      </div>
                      <p className="text-sm text-green-700">Additional annual revenue</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Gap Closure</h4>
                      <div className="text-xl font-bold text-blue-600">
                        {formatPercent((calculateCustomRevenue() / currentData.remainingGap) * 100)}
                      </div>
                      <p className="text-sm text-blue-700">Of remaining deficit closed</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Behavioral Effects Included</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• High earners reduce reported income</li>
                        <li>• Corporations shift profits/investments</li>
                        <li>• Capital gains timing effects</li>
                        <li>• Wealth tax avoidance strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impacts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Economic Impact Comparison</CardTitle>
                  <CardDescription>GDP, employment, and investment effects by scenario</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      gdpImpact: { label: "GDP Impact", color: "hsl(var(--chart-1))" },
                      employmentImpact: { label: "Employment Impact", color: "hsl(var(--chart-2))" },
                      investmentImpact: { label: "Investment Impact", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={economicImpacts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="scenario" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.name}: {formatPercent(entry.value as number)}
                                    </p>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="gdpImpact" fill="var(--color-gdpImpact)" />
                        <Bar dataKey="employmentImpact" fill="var(--color-employmentImpact)" />
                        <Bar dataKey="investmentImpact" fill="var(--color-investmentImpact)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projections</CardTitle>
                  <CardDescription>5-year revenue outlook by scenario</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      baseline: { label: "Baseline", color: "hsl(var(--chart-1))" },
                      progressive: { label: "Progressive", color: "hsl(var(--chart-2))" },
                      broadBased: { label: "Broad-Based", color: "hsl(var(--chart-3))" },
                      innovation: { label: "Innovation", color: "hsl(var(--chart-4))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueProjections}>
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
                                      {entry.name}: {formatBillions(entry.value as number)}
                                    </p>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="baseline" stroke="var(--color-baseline)" strokeWidth={2} />
                        <Line type="monotone" dataKey="progressive" stroke="var(--color-progressive)" strokeWidth={2} />
                        <Line type="monotone" dataKey="broadBased" stroke="var(--color-broadBased)" strokeWidth={2} />
                        <Line type="monotone" dataKey="innovation" stroke="var(--color-innovation)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Economic Considerations</CardTitle>
                <CardDescription>Critical factors affecting revenue and growth</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Behavioral Responses</h4>
                  <p className="text-sm text-red-700 mt-1">
                    High earners may reduce work, relocate, or restructure income. Corporate inversions and
                    profit-shifting increase.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Dynamic Effects</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Tax increases reduce economic growth, which partially offsets revenue gains. Multiplier effects vary
                    by tax type.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Implementation Challenges</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    New taxes require administrative capacity. Wealth taxes face valuation issues. International
                    coordination needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Burden Distribution</CardTitle>
                <CardDescription>How different income groups would be affected</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    currentShare: { label: "Current Share", color: "hsl(var(--chart-1))" },
                    newShare: { label: "New Share", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.distributionalImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="percentile" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm">Current: {formatPercent(data.currentShare)}</p>
                                <p className="text-sm">New: {formatPercent(data.newShare)}</p>
                                <p className="text-sm">Impact: {formatPercent(data.impact)} of income</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="currentShare" fill="var(--color-currentShare)" />
                      <Bar dataKey="newShare" fill="var(--color-newShare)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progressive Impact Analysis</CardTitle>
                  <CardDescription>Tax burden changes by income level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.distributionalImpact.map((group, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{group.percentile}</div>
                          <div className="text-xs text-gray-600">Income Group</div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold text-sm ${group.impact > 5 ? "text-red-600" : group.impact > 2 ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {formatPercent(group.impact)}
                          </div>
                          <div className="text-xs text-gray-600">of income</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fairness Considerations</CardTitle>
                  <CardDescription>Distributional impact analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Progressive Structure</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Top 1% bears 12.4% burden vs 7.9% current share, maintaining progressive taxation principle.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Middle Class Impact</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Middle quintiles see modest increases (1-3% of income), but benefit from deficit reduction.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Economic Mobility</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Higher taxes on wealth may reduce inequality but could affect entrepreneurship and investment.
                    </p>
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
