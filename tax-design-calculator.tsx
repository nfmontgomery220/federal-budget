"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, DollarSign, Users, Target, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface TaxBracket {
  min: number
  max: number | null
  rate: number
}

interface TaxPolicy {
  id: string
  name: string
  description: string
  currentRate: number
  proposedRate: number
  revenueImpact: number
  economicImpact: string
  politicalFeasibility: number
}

const initialTaxBrackets: TaxBracket[] = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11000, max: 44725, rate: 12 },
  { min: 44725, max: 95375, rate: 22 },
  { min: 95375, max: 182050, rate: 24 },
  { min: 182050, max: 231250, rate: 32 },
  { min: 231250, max: 578125, rate: 35 },
  { min: 578125, max: null, rate: 37 },
]

const taxPolicies: TaxPolicy[] = [
  {
    id: "corporate",
    name: "Corporate Tax Rate",
    description: "Tax rate on corporate profits",
    currentRate: 21,
    proposedRate: 28,
    revenueImpact: 133,
    economicImpact: "Moderate negative impact on business investment",
    politicalFeasibility: 65,
  },
  {
    id: "capital_gains",
    name: "Capital Gains Tax",
    description: "Tax on investment gains for high earners",
    currentRate: 20,
    proposedRate: 28,
    revenueImpact: 78,
    economicImpact: "May reduce investment activity",
    politicalFeasibility: 45,
  },
  {
    id: "estate_tax",
    name: "Estate Tax",
    description: "Tax on inherited wealth above exemption",
    currentRate: 40,
    proposedRate: 45,
    revenueImpact: 23,
    economicImpact: "Minimal economic impact, affects few families",
    politicalFeasibility: 35,
  },
  {
    id: "payroll_cap",
    name: "Payroll Tax Cap Removal",
    description: "Remove Social Security tax cap on high earners",
    currentRate: 0,
    proposedRate: 100,
    revenueImpact: 165,
    economicImpact: "Increases tax burden on high earners",
    politicalFeasibility: 55,
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function TaxDesignCalculator() {
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(initialTaxBrackets)
  const [policies, setPolicies] = useState<TaxPolicy[]>(taxPolicies)
  const [activeTab, setActiveTab] = useState("brackets")

  const handleBracketRateChange = (index: number, newRate: number[]) => {
    const updatedBrackets = [...taxBrackets]
    updatedBrackets[index].rate = newRate[0]
    setTaxBrackets(updatedBrackets)
  }

  const handlePolicyRateChange = (policyId: string, newRate: number[]) => {
    const updatedPolicies = policies.map((policy) =>
      policy.id === policyId ? { ...policy, proposedRate: newRate[0] } : policy,
    )
    setPolicies(updatedPolicies)
  }

  const calculateTotalRevenue = () => {
    const bracketRevenue = taxBrackets.reduce((sum, bracket) => {
      // Simplified calculation - in reality this would be much more complex
      const baseRevenue = bracket.rate * 10 // Placeholder calculation
      return sum + baseRevenue
    }, 0)

    const policyRevenue = policies.reduce((sum, policy) => {
      const rateIncrease = (policy.proposedRate - policy.currentRate) / 100
      return sum + policy.revenueImpact * rateIncrease
    }, 0)

    return bracketRevenue + policyRevenue
  }

  const calculateEffectiveRate = (income: number) => {
    let tax = 0
    let remainingIncome = income

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break

      const bracketMax = bracket.max || income
      const taxableInThisBracket = Math.min(remainingIncome, bracketMax - bracket.min)

      if (taxableInThisBracket > 0) {
        tax += (taxableInThisBracket * bracket.rate) / 100
        remainingIncome -= taxableInThisBracket
      }
    }

    return (tax / income) * 100
  }

  const incomeScenarios = [
    { income: 50000, label: "$50K" },
    { income: 100000, label: "$100K" },
    { income: 200000, label: "$200K" },
    { income: 500000, label: "$500K" },
    { income: 1000000, label: "$1M" },
    { income: 10000000, label: "$10M" },
  ]

  const effectiveRateData = incomeScenarios.map((scenario) => ({
    ...scenario,
    effectiveRate: calculateEffectiveRate(scenario.income),
  }))

  const totalRevenue = calculateTotalRevenue()
  const revenueChange = totalRevenue - 2040 // Baseline individual income tax revenue

  const policyImpactData = policies.map((policy, index) => ({
    name: policy.name,
    impact: policy.revenueImpact * ((policy.proposedRate - policy.currentRate) / 100),
    feasibility: policy.politicalFeasibility,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Tax Design Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Design and analyze comprehensive tax policy reforms. Adjust rates, brackets, and policies to optimize revenue
          while considering economic and political impacts.
        </p>
      </div>

      {/* Revenue Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className={`text-2xl font-bold ${revenueChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(0)}B
                </p>
                <p className="text-sm text-muted-foreground">vs. Current</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{calculateEffectiveRate(100000).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Middle Class Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{calculateEffectiveRate(1000000).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">High Earner Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Impact Alert */}
      {Math.abs(revenueChange) > 100 && (
        <Alert className={revenueChange > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {revenueChange > 0 ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={revenueChange > 0 ? "text-green-800" : "text-red-800"}>
            <strong>Significant Revenue Impact:</strong> Your tax design would{" "}
            {revenueChange > 0 ? "increase" : "decrease"} federal revenue by ${Math.abs(revenueChange).toFixed(0)}B
            annually. Consider the economic and political implications of this change.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brackets">Tax Brackets</TabsTrigger>
          <TabsTrigger value="policies">Policy Tools</TabsTrigger>
          <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="brackets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Income Tax Brackets</CardTitle>
              <CardDescription>Adjust marginal tax rates for different income levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {taxBrackets.map((bracket, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        ${bracket.min.toLocaleString()} - {bracket.max ? `$${bracket.max.toLocaleString()}` : "∞"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {index === 0 && "Lowest income bracket"}
                        {index === taxBrackets.length - 1 && "Highest income bracket"}
                        {index > 0 && index < taxBrackets.length - 1 && "Middle income bracket"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{bracket.rate}%</p>
                      <Badge variant="outline">Marginal Rate</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[bracket.rate]}
                      onValueChange={(value) => handleBracketRateChange(index, value)}
                      min={0}
                      max={50}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>Current: {bracket.rate}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Effective Tax Rates by Income</CardTitle>
              <CardDescription>How your bracket changes affect different income levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={effectiveRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Effective Rate"]} />
                  <Line type="monotone" dataKey="effectiveRate" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid gap-6">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{policy.name}</span>
                    <Badge variant="outline">{policy.proposedRate}%</Badge>
                  </CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Revenue Impact</p>
                      <p className="text-2xl font-bold text-green-600">
                        +${(policy.revenueImpact * ((policy.proposedRate - policy.currentRate) / 100)).toFixed(0)}B
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Political Feasibility</p>
                      <div className="flex items-center gap-2">
                        <Progress value={policy.politicalFeasibility} className="flex-1" />
                        <span className="text-sm font-medium">{policy.politicalFeasibility}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Rate</p>
                      <p className="text-lg font-semibold">{policy.currentRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Proposed Rate</span>
                      <span className="text-sm font-medium">{policy.proposedRate}%</span>
                    </div>
                    <Slider
                      value={[policy.proposedRate]}
                      onValueChange={(value) => handlePolicyRateChange(policy.id, value)}
                      min={0}
                      max={policy.id === "payroll_cap" ? 100 : 50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>Current: {policy.currentRate}%</span>
                      <span>{policy.id === "payroll_cap" ? "100%" : "50%"}</span>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Economic Impact:</strong> {policy.economicImpact}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Revenue Impact</CardTitle>
                <CardDescription>Revenue generated by each policy change</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={policyImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(0)}B`, "Revenue Impact"]} />
                    <Bar dataKey="impact" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Political Feasibility vs Impact</CardTitle>
                <CardDescription>Balance between revenue potential and political viability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyImpactData.map((policy) => (
                    <div key={policy.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{policy.name}</span>
                        <span className="text-sm">
                          ${policy.impact.toFixed(0)}B | {policy.feasibility}% feasible
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Revenue Impact</div>
                          <Progress value={(policy.impact / 200) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Political Feasibility</div>
                          <Progress value={policy.feasibility} className="h-2" />
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
              <CardTitle>Tax Burden Distribution</CardTitle>
              <CardDescription>How your tax design affects different income groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incomeScenarios.map((scenario) => (
                  <div key={scenario.income} className="text-center p-4 border rounded-lg">
                    <p className="text-lg font-semibold">{scenario.label}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {calculateEffectiveRate(scenario.income).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Effective Rate</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progressive Scenario</CardTitle>
                <CardDescription>Higher rates on wealthy, lower on middle class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Top Rate Increase</span>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Middle Class Relief</span>
                    <Badge variant="outline">-2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Impact</span>
                    <Badge className="bg-green-100 text-green-800">+$180B</Badge>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Apply Progressive Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flat Tax Scenario</CardTitle>
                <CardDescription>Single rate for all income levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Flat Rate</span>
                    <Badge>20%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Simplification</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Impact</span>
                    <Badge className="bg-red-100 text-red-800">-$340B</Badge>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Apply Flat Tax Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Neutral</CardTitle>
                <CardDescription>Maintain current revenue levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Rate Adjustments</span>
                    <Badge variant="outline">Minimal</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bracket Optimization</span>
                    <Badge>Moderate</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Impact</span>
                    <Badge className="bg-blue-100 text-blue-800">$0B</Badge>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Apply Revenue Neutral
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deficit Reduction</CardTitle>
                <CardDescription>Maximum revenue generation focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Top Rate</span>
                    <Badge>50%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Corporate Rate</span>
                    <Badge>35%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Impact</span>
                    <Badge className="bg-green-100 text-green-800">+$450B</Badge>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Apply Deficit Reduction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
