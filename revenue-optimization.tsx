"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, AlertTriangle, DollarSign, Shield, Download, Target, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Import the tax policy scenarios component
import TaxPolicyScenarios from "./tax-policy-scenarios"

// Tax expenditures and loopholes data (in billions)
const revenueOptimizationData = {
  2025: {
    totalDeficit: 2650, // Updated from 1850 to reflect the actual 2025 deficit
    taxExpenditures: {
      total: 1840, // Total tax expenditures
      categories: [
        {
          name: "Individual Tax Expenditures",
          amount: 1240,
          color: "#3b82f6",
          items: [
            { name: "Mortgage Interest Deduction", amount: 25.1, impact: "high", difficulty: "hard" },
            { name: "State & Local Tax Deduction", amount: 13.8, impact: "medium", difficulty: "medium" },
            { name: "Charitable Deduction", amount: 65.3, impact: "medium", difficulty: "hard" },
            { name: "401(k) Contributions", amount: 67.4, impact: "low", difficulty: "hard" },
            { name: "Health Insurance Exclusion", amount: 184.3, impact: "low", difficulty: "hard" },
            { name: "Capital Gains Preference", amount: 162.9, impact: "high", difficulty: "medium" },
            { name: "Carried Interest Loophole", amount: 1.4, impact: "high", difficulty: "easy" },
            { name: "Step-up Basis at Death", amount: 41.9, impact: "high", difficulty: "medium" },
          ],
        },
        {
          name: "Corporate Tax Expenditures",
          amount: 420,
          color: "#10b981",
          items: [
            { name: "R&D Tax Credit", amount: 13.5, impact: "low", difficulty: "hard" },
            { name: "Accelerated Depreciation", amount: 89.2, impact: "medium", difficulty: "medium" },
            { name: "Depletion Allowance", amount: 1.2, impact: "high", difficulty: "easy" },
            { name: "Foreign Tax Credit Abuse", amount: 12.8, impact: "high", difficulty: "medium" },
            { name: "Transfer Pricing Manipulation", amount: 45.6, impact: "high", difficulty: "medium" },
            { name: "Debt vs Equity Bias", amount: 23.4, impact: "medium", difficulty: "medium" },
            { name: "Like-Kind Exchanges", amount: 8.9, impact: "medium", difficulty: "easy" },
          ],
        },
        {
          name: "International Tax Avoidance",
          amount: 180,
          color: "#f59e0b",
          items: [
            { name: "Profit Shifting to Tax Havens", amount: 78.5, impact: "high", difficulty: "hard" },
            { name: "Inversions & Base Erosion", amount: 23.4, impact: "high", difficulty: "medium" },
            { name: "Digital Services Tax Gap", amount: 15.6, impact: "high", difficulty: "medium" },
            { name: "Offshore IP Licensing", amount: 34.2, impact: "high", difficulty: "medium" },
            { name: "Treaty Shopping", amount: 12.8, impact: "high", difficulty: "medium" },
            { name: "Hybrid Mismatch Arrangements", amount: 15.5, impact: "high", difficulty: "hard" },
          ],
        },
      ],
    },
    enforcementGap: {
      total: 496, // IRS tax gap estimate
      categories: [
        { name: "Individual Income Tax", amount: 314, percentage: 63.3 },
        { name: "Corporate Income Tax", amount: 67, percentage: 13.5 },
        { name: "Employment Tax", amount: 115, percentage: 23.2 },
      ],
    },
    potentialRevenue: {
      quickWins: [
        { name: "Close Carried Interest Loophole", amount: 1.4, timeframe: "1 year", difficulty: "easy" },
        { name: "End Depletion Allowance", amount: 1.2, timeframe: "1 year", difficulty: "easy" },
        { name: "Limit Like-Kind Exchanges", amount: 4.5, timeframe: "1 year", difficulty: "easy" },
        { name: "Digital Services Tax", amount: 15.6, timeframe: "2 years", difficulty: "medium" },
        { name: "Minimum Tax on Large Corps", amount: 89.3, timeframe: "2 years", difficulty: "medium" },
      ],
      mediumTerm: [
        { name: "Reform Step-up Basis", amount: 41.9, timeframe: "3-5 years", difficulty: "medium" },
        { name: "Cap SALT Deduction Permanently", amount: 13.8, timeframe: "3-5 years", difficulty: "medium" },
        { name: "Transfer Pricing Reform", amount: 45.6, timeframe: "3-5 years", difficulty: "medium" },
        { name: "Accelerated Depreciation Reform", amount: 44.6, timeframe: "3-5 years", difficulty: "medium" },
        { name: "International Tax Coordination", amount: 78.5, timeframe: "5+ years", difficulty: "hard" },
      ],
      enforcement: [
        { name: "IRS Funding Increase", amount: 203, timeframe: "3-5 years", difficulty: "medium" },
        { name: "Third-Party Reporting Expansion", amount: 89, timeframe: "2-3 years", difficulty: "medium" },
        { name: "Cryptocurrency Compliance", amount: 28, timeframe: "2-3 years", difficulty: "medium" },
        { name: "High-Income Audit Initiative", amount: 156, timeframe: "3-5 years", difficulty: "medium" },
      ],
    },
  },
}

const revenueScenarios = [
  {
    name: "Conservative Approach",
    description: "Easy wins + basic enforcement",
    totalRevenue: 234,
    deficitReduction: 12.6,
    items: ["Carried Interest", "Depletion", "Digital Tax", "Basic IRS Funding"],
  },
  {
    name: "Moderate Reform",
    description: "Medium difficulty reforms",
    totalRevenue: 567,
    deficitReduction: 30.6,
    items: ["Quick wins", "Step-up basis", "Transfer pricing", "Enhanced enforcement"],
  },
  {
    name: "Comprehensive Reform",
    description: "Full revenue optimization",
    totalRevenue: 892,
    deficitReduction: 48.2,
    items: ["All reforms", "International coordination", "Full enforcement"],
  },
]

const topLoopholes = [
  {
    name: "Capital Gains Preference",
    amount: 162.9,
    description: "Lower tax rates on investment income vs wages",
    beneficiaries: "High-income investors",
    reform: "Treat capital gains as ordinary income for high earners",
    difficulty: "Medium",
    politicalRisk: "High",
  },
  {
    name: "Health Insurance Exclusion",
    amount: 184.3,
    description: "Employer health premiums excluded from income",
    beneficiaries: "All employees with employer insurance",
    reform: "Cap exclusion at median plan cost",
    difficulty: "Hard",
    politicalRisk: "Very High",
  },
  {
    name: "Profit Shifting",
    amount: 78.5,
    description: "Multinational corporations shift profits to tax havens",
    beneficiaries: "Large multinational corporations",
    reform: "Global minimum tax enforcement",
    difficulty: "Hard",
    politicalRisk: "Medium",
  },
  {
    name: "Transfer Pricing",
    amount: 45.6,
    description: "Manipulation of intercompany pricing",
    beneficiaries: "Multinational corporations",
    reform: "Formulary apportionment system",
    difficulty: "Medium",
    politicalRisk: "Medium",
  },
  {
    name: "Step-up Basis",
    amount: 41.9,
    description: "Capital gains taxes forgiven at death",
    beneficiaries: "Wealthy families",
    reform: "Treat death as realization event",
    difficulty: "Medium",
    politicalRisk: "High",
  },
]

interface RevenueOptimizationProps {
  onBack?: () => void
}

export default function RevenueOptimization({ onBack }: RevenueOptimizationProps) {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedScenario, setSelectedScenario] = useState("moderate")
  const [activeView, setActiveView] = useState("optimization") // optimization or tax-scenarios

  const currentData = revenueOptimizationData[selectedYear as keyof typeof revenueOptimizationData]

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const goToTaxScenarios = () => setActiveView("tax-scenarios")
  const backToOptimization = () => setActiveView("optimization")

  // Render tax scenarios view
  if (activeView === "tax-scenarios") {
    return <TaxPolicyScenarios onBack={backToOptimization} />
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
                  Back to Overview
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Revenue Optimization Analysis</h1>
            </div>
            <p className="text-gray-600">
              Identifying tax loopholes, expenditures, and enforcement gaps to close the $
              {formatBillions(currentData.totalDeficit)} deficit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">FY 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Deficit</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatBillions(currentData.totalDeficit)}</div>
              <p className="text-xs text-muted-foreground">Revenue shortfall</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Expenditures</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatBillions(currentData.taxExpenditures.total)}
              </div>
              <p className="text-xs text-muted-foreground">Annual revenue loss</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enforcement Gap</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatBillions(currentData.enforcementGap.total)}
              </div>
              <p className="text-xs text-muted-foreground">Uncollected taxes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Recovery</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$892B</div>
              <p className="text-xs text-muted-foreground">With comprehensive reform</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="loopholes">Tax Loopholes</TabsTrigger>
            <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
            <TabsTrigger value="scenarios">Reform Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Loss Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Loss Sources</CardTitle>
                  <CardDescription>Where potential revenue is being lost</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
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
                                  <p className="text-sm text-gray-600">{formatBillions(data.amount)}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <PieChart
                          data={[
                            ...currentData.taxExpenditures.categories,
                            { name: "Enforcement Gap", amount: currentData.enforcementGap.total, color: "#8b5cf6" },
                          ]}
                        >
                          {[
                            ...currentData.taxExpenditures.categories,
                            { name: "Enforcement Gap", amount: currentData.enforcementGap.total, color: "#8b5cf6" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </PieChart>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Quick Wins */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Wins (1-2 Years)
                  </CardTitle>
                  <CardDescription>Low-hanging fruit for immediate revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.potentialRevenue.quickWins.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{formatBillions(item.amount)}</div>
                          <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total Quick Wins:</span>
                        <span className="text-green-600">
                          {formatBillions(
                            currentData.potentialRevenue.quickWins.reduce((sum, item) => sum + item.amount, 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* The Gap Challenge */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    The Remaining Challenge
                  </div>
                  <Button onClick={goToTaxScenarios} className="bg-red-600 hover:bg-red-700">
                    Analyze Tax Scenarios
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{formatBillions(2650)}</div>
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
                    <div className="text-2xl font-bold text-red-600">{formatBillions(1850)}</div>
                    <div className="text-sm text-red-700">Remaining Gap</div>
                  </div>
                </div>
                <p className="text-red-800 font-medium">
                  After closing loopholes and improving enforcement, approximately <strong>$1.85 trillion</strong> in
                  additional revenue is still needed. This requires difficult decisions about tax increases across
                  different income levels and new revenue sources.
                </p>
              </CardContent>
            </Card>

            {/* Top Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Opportunities</CardTitle>
                <CardDescription>Highest-impact reforms ranked by potential revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLoopholes.map((loophole, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-lg">{loophole.name}</h4>
                          <p className="text-sm text-gray-600">{loophole.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">{formatBillions(loophole.amount)}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getDifficultyColor(loophole.difficulty)}>{loophole.difficulty}</Badge>
                            <Badge variant="outline">{loophole.politicalRisk} Risk</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="font-medium">Beneficiaries: </span>
                          <span className="text-gray-600">{loophole.beneficiaries}</span>
                        </div>
                        <div>
                          <span className="font-medium">Reform: </span>
                          <span className="text-gray-600">{loophole.reform}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loopholes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentData.taxExpenditures.categories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>Total: {formatBillions(category.amount)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge size="sm" className={getImpactColor(item.impact)}>
                                {item.impact} impact
                              </Badge>
                              <Badge size="sm" className={getDifficultyColor(item.difficulty)}>
                                {item.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="font-bold text-sm">{formatBillions(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enforcement" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Gap by Category</CardTitle>
                  <CardDescription>
                    Taxes owed but not collected: {formatBillions(currentData.enforcementGap.total)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: { label: "Amount", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentData.enforcementGap.categories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm text-gray-600">{formatBillions(payload[0].value as number)}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="amount" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enforcement Initiatives</CardTitle>
                  <CardDescription>Potential revenue from better enforcement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.potentialRevenue.enforcement.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">{formatBillions(item.amount)}</div>
                          <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {revenueScenarios.map((scenario, index) => (
                <Card
                  key={index}
                  className={
                    selectedScenario === scenario.name.toLowerCase().split(" ")[0] ? "ring-2 ring-blue-500" : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {scenario.name}
                      <Button
                        variant={selectedScenario === scenario.name.toLowerCase().split(" ")[0] ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedScenario(scenario.name.toLowerCase().split(" ")[0])}
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
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPercent(scenario.deficitReduction)}
                        </div>
                        <div className="text-sm text-gray-600">Deficit Reduction</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Includes:</h4>
                        <ul className="text-sm space-y-1">
                          {scenario.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action for Tax Scenarios */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-blue-800">
                  <div>Next Step: Tax Policy Analysis</div>
                  <Button onClick={goToTaxScenarios} className="bg-blue-600 hover:bg-blue-700">
                    Analyze Tax Increase Scenarios
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  Even with comprehensive reform, closing loopholes and improving enforcement only addresses about half
                  the deficit. The remaining ~$1 trillion requires difficult decisions about tax increases. Explore
                  different approaches to raising the necessary revenue while considering economic impacts and political
                  feasibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
                <CardDescription>Phased approach to revenue optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Year 1-2: Quick Wins ($112B)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• Close carried interest loophole</div>
                      <div>• End depletion allowance</div>
                      <div>• Implement digital services tax</div>
                      <div>• Basic IRS funding increase</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Year 3-5: Medium Reforms ($455B)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• Reform step-up basis at death</div>
                      <div>• Transfer pricing overhaul</div>
                      <div>• Enhanced enforcement programs</div>
                      <div>• International tax coordination</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Year 5+: Comprehensive Reform ($325B)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>• Capital gains reform</div>
                      <div>• Full profit-shifting prevention</div>
                      <div>• Complete enforcement modernization</div>
                      <div>• Global tax coordination</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
