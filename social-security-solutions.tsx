"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Calculator, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Social Security reform data and solutions
const socialSecurityData = {
  2024: {
    currentSystem: {
      payrollTaxRate: 12.4, // Combined employer/employee
      currentCap: 160200,
      trustFundBalance: 2780, // billions
      annualDeficit: 23, // billions
      depletionYear: 2034,
      beneficiaries: 67000000,
      workers: 182000000,
      workerToBeneficiaryRatio: 2.8,
    },

    crisis: {
      shortfall75Year: 3.5, // % of taxable payroll
      shortfallDollars: 22400, // billions over 75 years
      automaticCutPercent: 23, // If no action taken
      yearsUntilDepletion: 10,
    },

    // The Buffett Plan variations
    buffettPlan: {
      fullCapRemoval: {
        name: "Full Cap Removal (Pure Buffett)",
        description: "Remove $160K cap entirely, tax all earnings",
        revenueIncrease: 1240, // billions over 10 years
        problemSolved: 71, // percentage
        workersAffected: 6.2, // percentage
        avgTaxIncrease: 9920, // for affected workers
        politicalDifficulty: "Extreme",
        economicImpact: -0.8,
      },
      gradualIncrease: {
        name: "Gradual Cap Increase",
        description: "Raise cap to $250K over 10 years",
        revenueIncrease: 520, // billions over 10 years
        problemSolved: 30, // percentage
        workersAffected: 2.8, // percentage
        avgTaxIncrease: 3720, // for affected workers
        politicalDifficulty: "High",
        economicImpact: -0.3,
      },
      donutHole: {
        name: "Donut Hole Approach",
        description: "Tax earnings above $400K, keep current cap",
        revenueIncrease: 180, // billions over 10 years
        problemSolved: 10, // percentage
        workersAffected: 0.4, // percentage
        avgTaxIncrease: 24800, // for affected workers
        politicalDifficulty: "Medium",
        economicImpact: -0.1,
      },
    },

    // Other realistic solutions
    otherSolutions: {
      retirementAge: {
        name: "Gradual Retirement Age Increase",
        description: "Raise full retirement age to 67.5 by 2040",
        savingsAmount: 340, // billions over 10 years
        problemSolved: 15, // percentage
        workersAffected: 100, // percentage (future workers)
        politicalDifficulty: "Very High",
        economicImpact: 0.2, // Positive from longer working
      },
      chainedCPI: {
        name: "Chained CPI Adjustment",
        description: "Use chained CPI for benefit adjustments",
        savingsAmount: 450, // billions over 10 years
        problemSolved: 20, // percentage
        beneficiariesAffected: 100, // percentage
        avgBenefitReduction: 180, // per month after 10 years
        politicalDifficulty: "High",
        economicImpact: -0.1,
      },
      meansTesting: {
        name: "High-Earner Means Testing",
        description: "Reduce benefits for high lifetime earners",
        savingsAmount: 230, // billions over 10 years
        problemSolved: 10, // percentage
        beneficiariesAffected: 5, // percentage
        avgBenefitReduction: 850, // per month
        politicalDifficulty: "Medium",
        economicImpact: 0.0,
      },
      benefitFormula: {
        name: "Progressive Benefit Formula",
        description: "Reduce replacement rates for high earners",
        savingsAmount: 380, // billions over 10 years
        problemSolved: 17, // percentage
        beneficiariesAffected: 25, // percentage
        avgBenefitReduction: 320, // per month
        politicalDifficulty: "High",
        economicImpact: -0.1,
      },
    },

    // Combination scenarios
    scenarios: [
      {
        name: "Balanced Approach",
        description: "Combines modest tax increases with benefit adjustments",
        components: [
          { type: "Gradual Cap Increase", contribution: 30 },
          { type: "Chained CPI", contribution: 20 },
          { type: "Retirement Age to 67.5", contribution: 15 },
          { type: "High-Earner Means Testing", contribution: 10 },
        ],
        totalSolution: 75,
        politicalFeasibility: "Challenging but Possible",
        implementationYears: 15,
        economicImpact: -0.2,
      },
      {
        name: "Progressive Tax Solution",
        description: "Primarily tax increases on high earners",
        components: [
          { type: "Gradual Cap Increase", contribution: 30 },
          { type: "Donut Hole Above $400K", contribution: 10 },
          { type: "Higher Rate on High Earners", contribution: 25 },
          { type: "Investment Income Tax", contribution: 15 },
        ],
        totalSolution: 80,
        politicalFeasibility: "Democratic Support Only",
        implementationYears: 10,
        economicImpact: -0.4,
      },
      {
        name: "Benefit Reform Focus",
        description: "Primarily benefit adjustments and efficiency",
        components: [
          { type: "Retirement Age to 68", contribution: 25 },
          { type: "Chained CPI", contribution: 20 },
          { type: "Progressive Benefit Formula", contribution: 17 },
          { type: "Means Testing Expansion", contribution: 18 },
        ],
        totalSolution: 80,
        politicalFeasibility: "Republican Support Only",
        implementationYears: 20,
        economicImpact: 0.1,
      },
    ],

    // International comparisons
    international: [
      {
        country: "United Kingdom",
        system: "No cap, means-tested",
        payrollRate: 25.8, // Combined
        retirementAge: 66,
        replacementRate: 29, // % of pre-retirement income
        notes: "Flat-rate benefit, means-tested pension credit",
      },
      {
        country: "Germany",
        system: "High cap, earnings-related",
        payrollRate: 18.6,
        retirementAge: 67,
        replacementRate: 48,
        notes: "Cap at €87,600, strong private pillar",
      },
      {
        country: "Canada",
        system: "Moderate cap, flat + earnings",
        payrollRate: 11.9,
        retirementAge: 65,
        replacementRate: 40,
        notes: "Two-tier system, C$68,500 cap",
      },
      {
        country: "Australia",
        system: "No social security payroll tax",
        payrollRate: 11.0, // Mandatory private
        retirementAge: 67,
        replacementRate: 45,
        notes: "Means-tested pension + mandatory private accounts",
      },
    ],
  },
}

const projectionData = [
  { year: 2024, trustFund: 2780, deficit: -23, ratio: 2.8 },
  { year: 2026, trustFund: 2650, deficit: -89, ratio: 2.7 },
  { year: 2028, trustFund: 2480, deficit: -156, ratio: 2.6 },
  { year: 2030, trustFund: 2250, deficit: -234, ratio: 2.5 },
  { year: 2032, trustFund: 1890, deficit: -312, ratio: 2.4 },
  { year: 2034, trustFund: 0, deficit: -390, ratio: 2.3 },
  { year: 2036, trustFund: 0, deficit: -468, ratio: 2.2 },
  { year: 2038, trustFund: 0, deficit: -546, ratio: 2.1 },
  { year: 2040, trustFund: 0, deficit: -624, ratio: 2.0 },
]

interface SocialSecuritySolutionsProps {
  onBack?: () => void
}

export default function SocialSecuritySolutions({ onBack }: SocialSecuritySolutionsProps) {
  const [activeTab, setActiveTab] = useState("buffett-plan")
  const [selectedScenario, setSelectedScenario] = useState("Balanced Approach")
  const [customReform, setCustomReform] = useState({
    capIncrease: 200000, // New cap level
    retirementAge: 67.0,
    benefitReduction: 0, // Percentage
    newTaxRate: 12.4,
  })

  const currentData = socialSecurityData[2024]

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`
  const formatThousands = (amount: number) => `$${amount.toLocaleString()}`

  const calculateCustomReform = () => {
    const capRevenue = ((customReform.capIncrease - currentData.currentSystem.currentCap) / 1000) * 3.2
    const ageRevenue = (customReform.retirementAge - 67) * 170
    const benefitSavings = customReform.benefitReduction * 22.4
    const rateSavings = (customReform.newTaxRate - 12.4) * 180

    return {
      totalImpact: capRevenue + ageRevenue + benefitSavings + rateSavings,
      problemSolved: Math.min(100, ((capRevenue + ageRevenue + benefitSavings + rateSavings) / 22.4) * 100),
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "very high":
        return "bg-red-100 text-red-800"
      case "extreme":
        return "bg-red-200 text-red-900"
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
                  Back to Analysis
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Social Security Solutions</h1>
            </div>
            <p className="text-gray-600">
              Realistic reform options to fix Social Security's $22.4 trillion shortfall, including the Buffett Plan
            </p>
          </div>
        </div>

        {/* Crisis Overview */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              The Social Security Crisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">2034</div>
                <div className="text-sm text-red-700">Trust Fund Depletion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">23%</div>
                <div className="text-sm text-red-700">Automatic Benefit Cut</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{formatBillions(22400)}</div>
                <div className="text-sm text-red-700">75-Year Shortfall</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">2.8:1</div>
                <div className="text-sm text-red-700">Worker-to-Beneficiary Ratio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="buffett-plan">Buffett Plan</TabsTrigger>
            <TabsTrigger value="other-solutions">Other Solutions</TabsTrigger>
            <TabsTrigger value="scenarios">Combination Plans</TabsTrigger>
            <TabsTrigger value="calculator">Reform Calculator</TabsTrigger>
            <TabsTrigger value="international">Global Models</TabsTrigger>
          </TabsList>

          <TabsContent value="buffett-plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Warren Buffett's Core Insight</CardTitle>
                <CardDescription>
                  "There is no reason why payroll taxes should be regressive. The wealthy should pay the same percentage
                  as everyone else."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Current System Problem</h4>
                  <p className="text-sm text-blue-800">
                    Workers earning $50,000 pay 12.4% of their income in Social Security taxes. Workers earning $500,000
                    pay only 4.0% because the tax stops at $160,200.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(currentData.buffettPlan).map(([key, plan]) => (
                <Card key={key} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{plan.problemSolved}%</div>
                        <div className="text-sm text-gray-600">Problem Solved</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{formatBillions(plan.revenueIncrease)}</div>
                          <div className="text-xs text-gray-600">10-Year Revenue</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">{formatPercent(plan.workersAffected)}</div>
                          <div className="text-xs text-gray-600">Workers Affected</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Avg Tax Increase:</span>
                          <span className="font-medium">{formatThousands(plan.avgTaxIncrease)}/year</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Economic Impact:</span>
                          <span className="font-medium">{formatPercent(plan.economicImpact)} GDP</span>
                        </div>
                      </div>

                      <Badge className={getDifficultyColor(plan.politicalDifficulty)}>
                        {plan.politicalDifficulty} Difficulty
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Buffett Plan Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Buffett Plan Analysis</CardTitle>
                <CardDescription>Detailed comparison of the three approaches</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    problemSolved: { label: "Problem Solved", color: "hsl(var(--chart-1))" },
                    workersAffected: { label: "Workers Affected", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.values(currentData.buffettPlan)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm">Problem Solved: {data.problemSolved}%</p>
                                <p className="text-sm">Workers Affected: {formatPercent(data.workersAffected)}</p>
                                <p className="text-sm">Revenue: {formatBillions(data.revenueIncrease)}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="problemSolved" fill="var(--color-problemSolved)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other-solutions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(currentData.otherSolutions).map(([key, solution]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{solution.name}</CardTitle>
                    <CardDescription>{solution.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{solution.problemSolved}%</div>
                        <div className="text-sm text-gray-600">Problem Solved</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>10-Year Impact:</span>
                          <span className="font-medium">{formatBillions(solution.savingsAmount)}</span>
                        </div>
                        {solution.workersAffected && (
                          <div className="flex justify-between">
                            <span>Workers Affected:</span>
                            <span className="font-medium">{formatPercent(solution.workersAffected)}</span>
                          </div>
                        )}
                        {solution.beneficiariesAffected && (
                          <div className="flex justify-between">
                            <span>Beneficiaries Affected:</span>
                            <span className="font-medium">{formatPercent(solution.beneficiariesAffected)}</span>
                          </div>
                        )}
                        {solution.avgBenefitReduction && (
                          <div className="flex justify-between">
                            <span>Avg Benefit Reduction:</span>
                            <span className="font-medium">${solution.avgBenefitReduction}/month</span>
                          </div>
                        )}
                        {solution.avgTaxIncrease && (
                          <div className="flex justify-between">
                            <span>Avg Tax Increase:</span>
                            <span className="font-medium">{formatThousands(solution.avgTaxIncrease)}/year</span>
                          </div>
                        )}
                      </div>

                      <Badge className={getDifficultyColor(solution.politicalDifficulty)}>
                        {solution.politicalDifficulty} Difficulty
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentData.scenarios.map((scenario, index) => (
                <Card key={index} className={selectedScenario === scenario.name ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{scenario.name}</span>
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
                        <div className="text-3xl font-bold text-green-600">{scenario.totalSolution}%</div>
                        <div className="text-sm text-gray-600">Problem Solved</div>
                      </div>

                      <div className="space-y-2">
                        {scenario.components.map((component, compIndex) => (
                          <div key={compIndex} className="flex justify-between text-sm">
                            <span>{component.type}:</span>
                            <span className="font-medium">{component.contribution}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Political Feasibility:</span>
                          <span className="font-medium text-xs">{scenario.politicalFeasibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Implementation:</span>
                          <span className="font-medium">{scenario.implementationYears} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Economic Impact:</span>
                          <span className="font-medium">{formatPercent(scenario.economicImpact)} GDP</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scenario Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario Effectiveness Comparison</CardTitle>
                <CardDescription>How much of the problem each approach solves</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalSolution: { label: "Problem Solved", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm">Problem Solved: {data.totalSolution}%</p>
                                <p className="text-sm">Implementation: {data.implementationYears} years</p>
                                <p className="text-sm">Feasibility: {data.politicalFeasibility}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="totalSolution" fill="var(--color-totalSolution)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Custom Reform Calculator
                </CardTitle>
                <CardDescription>Design your own Social Security reform package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payroll Tax Cap: ${customReform.capIncrease.toLocaleString()} (Current: $160,200)
                      </label>
                      <Slider
                        value={[customReform.capIncrease]}
                        onValueChange={(value) => setCustomReform({ ...customReform, capIncrease: value[0] })}
                        max={500000}
                        min={160200}
                        step={10000}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Retirement Age: {customReform.retirementAge} (Current: 67)
                      </label>
                      <Slider
                        value={[customReform.retirementAge]}
                        onValueChange={(value) => setCustomReform({ ...customReform, retirementAge: value[0] })}
                        max={70}
                        min={65}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Benefit Reduction: {customReform.benefitReduction}% (Current: 0%)
                      </label>
                      <Slider
                        value={[customReform.benefitReduction]}
                        onValueChange={(value) => setCustomReform({ ...customReform, benefitReduction: value[0] })}
                        max={25}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payroll Tax Rate: {customReform.newTaxRate}% (Current: 12.4%)
                      </label>
                      <Slider
                        value={[customReform.newTaxRate]}
                        onValueChange={(value) => setCustomReform({ ...customReform, newTaxRate: value[0] })}
                        max={16}
                        min={12.4}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Reform Impact</h4>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercent(calculateCustomReform().problemSolved)}
                      </div>
                      <p className="text-sm text-green-700">Of the problem solved</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Total Financial Impact</h4>
                      <div className="text-xl font-bold text-blue-600">
                        {formatBillions(calculateCustomReform().totalImpact)}
                      </div>
                      <p className="text-sm text-blue-700">10-year improvement</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Political Reality Check</h4>
                      <p className="text-sm text-yellow-700">
                        {calculateCustomReform().problemSolved > 80
                          ? "Comprehensive solution but extremely difficult politically"
                          : calculateCustomReform().problemSolved > 50
                            ? "Significant progress, challenging but possible"
                            : "Modest improvement, more politically feasible"}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Implementation Timeline</h4>
                      <p className="text-sm text-purple-700">
                        Estimated {Math.ceil(calculateCustomReform().problemSolved / 5)} years for full phase-in
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="international" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>International Social Security Systems</CardTitle>
                <CardDescription>How other developed countries structure retirement benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentData.international.map((country, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{country.country}</CardTitle>
                        <CardDescription>{country.system}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-xl font-bold text-blue-600">
                                {formatPercent(country.payrollRate)}
                              </div>
                              <div className="text-xs text-gray-600">Payroll Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-green-600">{country.retirementAge}</div>
                              <div className="text-xs text-gray-600">Retirement Age</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {formatPercent(country.replacementRate)}
                            </div>
                            <div className="text-xs text-gray-600">Income Replacement Rate</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded text-sm">
                            <strong>Key Features:</strong> {country.notes}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* International Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Payroll Rates vs Replacement Rates</CardTitle>
                <CardDescription>Higher contributions generally mean higher benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    replacementRate: { label: "Replacement Rate", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      data={[
                        ...currentData.international,
                        { country: "United States", payrollRate: 12.4, replacementRate: 40 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="payrollRate" name="Payroll Rate" />
                      <YAxis dataKey="replacementRate" name="Replacement Rate" />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.country}</p>
                                <p className="text-sm">Payroll Rate: {formatPercent(data.payrollRate)}</p>
                                <p className="text-sm">Replacement Rate: {formatPercent(data.replacementRate)}</p>
                                <p className="text-sm">Retirement Age: {data.retirementAge}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter dataKey="replacementRate" fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
