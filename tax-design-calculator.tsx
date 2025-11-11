"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, DollarSign, Users, Building, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface TaxBracket {
  id: string
  name: string
  min: number
  max: number | null
  currentRate: number
  proposedRate: number
  population: number
  avgIncome: number
}

const initialTaxBrackets: TaxBracket[] = [
  {
    id: "bracket1",
    name: "$0 - $11,000",
    min: 0,
    max: 11000,
    currentRate: 10,
    proposedRate: 10,
    population: 28000000,
    avgIncome: 8500,
  },
  {
    id: "bracket2",
    name: "$11,001 - $44,725",
    min: 11001,
    max: 44725,
    currentRate: 12,
    proposedRate: 12,
    population: 53000000,
    avgIncome: 28000,
  },
  {
    id: "bracket3",
    name: "$44,726 - $95,375",
    min: 44726,
    max: 95375,
    currentRate: 22,
    proposedRate: 22,
    population: 35000000,
    avgIncome: 70000,
  },
  {
    id: "bracket4",
    name: "$95,376 - $182,050",
    min: 95376,
    max: 182050,
    currentRate: 24,
    proposedRate: 24,
    population: 18000000,
    avgIncome: 138000,
  },
  {
    id: "bracket5",
    name: "$182,051 - $231,250",
    min: 182051,
    max: 231250,
    currentRate: 32,
    proposedRate: 32,
    population: 8000000,
    avgIncome: 206000,
  },
  {
    id: "bracket6",
    name: "$231,251 - $578,125",
    min: 231251,
    max: 578125,
    currentRate: 35,
    proposedRate: 35,
    population: 5000000,
    avgIncome: 404000,
  },
  {
    id: "bracket7",
    name: "Over $578,125",
    min: 578126,
    max: null,
    currentRate: 37,
    proposedRate: 37,
    population: 3000000,
    avgIncome: 1200000,
  },
]

export default function TaxDesignCalculator() {
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(initialTaxBrackets)
  const [corporateRate, setCorporateRate] = useState(21)
  const [capitalGainsRate, setCapitalGainsRate] = useState(20)
  const [showResults, setShowResults] = useState(false)

  const updateBracketRate = (id: string, newRate: number) => {
    setTaxBrackets((prev) =>
      prev.map((bracket) => (bracket.id === id ? { ...bracket, proposedRate: newRate } : bracket)),
    )
  }

  const calculateRevenue = () => {
    const individualRevenue = taxBrackets.reduce((total, bracket) => {
      const avgTaxableIncome = Math.max(0, bracket.avgIncome - 12950) // Standard deduction
      const effectiveRate = bracket.proposedRate / 100
      return total + bracket.population * avgTaxableIncome * effectiveRate
    }, 0)

    const corporateRevenue = (corporateRate / 21) * 420 * 1000000000 // Scale from current $420B
    const capitalGainsRevenue = (capitalGainsRate / 20) * 163 * 1000000000 // Scale from current $163B

    return {
      individual: individualRevenue / 1000000000, // Convert to billions
      corporate: corporateRevenue / 1000000000,
      capitalGains: capitalGainsRevenue / 1000000000,
      total: (individualRevenue + corporateRevenue + capitalGainsRevenue) / 1000000000,
    }
  }

  const currentRevenue = {
    individual: 2044,
    corporate: 420,
    capitalGains: 163,
    total: 2627,
  }

  const proposedRevenue = calculateRevenue()
  const revenueChange = proposedRevenue.total - currentRevenue.total
  const revenueChangePercent = (revenueChange / currentRevenue.total) * 100

  const resetToDefaults = () => {
    setTaxBrackets(initialTaxBrackets)
    setCorporateRate(21)
    setCapitalGainsRate(20)
    setShowResults(false)
  }

  const calculateProgressivity = () => {
    const lowestRate = Math.min(...taxBrackets.map((b) => b.proposedRate))
    const highestRate = Math.max(...taxBrackets.map((b) => b.proposedRate))
    return highestRate - lowestRate
  }

  const progressivity = calculateProgressivity()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Design Calculator</h1>
        <p className="text-gray-600">
          Design and analyze optimal tax policies for revenue generation and economic impact
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${proposedRevenue.total.toFixed(0)}B</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              {revenueChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                {revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(0)}B ({revenueChangePercent.toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Individual Income</p>
                <p className="text-2xl font-bold text-gray-900">${proposedRevenue.individual.toFixed(0)}B</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {((proposedRevenue.individual / proposedRevenue.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corporate Tax</p>
                <p className="text-2xl font-bold text-gray-900">${proposedRevenue.corporate.toFixed(0)}B</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">{corporateRate}% rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progressivity</p>
                <p className="text-2xl font-bold text-gray-900">{progressivity.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">Rate spread</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Alert */}
      {Math.abs(revenueChange) > 50 && (
        <Alert className={revenueChange > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {revenueChange > 0 ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            <strong>Revenue Impact:</strong>
            {revenueChange > 0 ? (
              <span className="text-green-800">
                Your tax design would increase federal revenue by ${Math.abs(revenueChange).toFixed(0)}B annually (
                {Math.abs(revenueChangePercent).toFixed(1)}% increase).
              </span>
            ) : (
              <span className="text-red-800">
                Your tax design would decrease federal revenue by ${Math.abs(revenueChange).toFixed(0)}B annually (
                {Math.abs(revenueChangePercent).toFixed(1)}% decrease).
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="individual">Individual Tax</TabsTrigger>
          <TabsTrigger value="corporate">Corporate Tax</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Individual Income Tax Brackets</h3>
            <Button onClick={resetToDefaults} variant="outline">
              Reset to Current Rates
            </Button>
          </div>

          <div className="grid gap-4">
            {taxBrackets.map((bracket) => {
              const change = bracket.proposedRate - bracket.currentRate
              return (
                <Card key={bracket.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{bracket.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {bracket.population.toLocaleString()} taxpayers • Avg income: $
                          {bracket.avgIncome.toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{bracket.proposedRate}%</div>
                        {change !== 0 && (
                          <div className={`text-sm ${change > 0 ? "text-red-600" : "text-green-600"}`}>
                            {change > 0 ? "+" : ""}
                            {change}% vs current
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Slider
                        value={[bracket.proposedRate]}
                        onValueChange={(value) => updateBracketRate(bracket.id, value[0])}
                        min={0}
                        max={50}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>Current: {bracket.currentRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Corporate Income Tax Rate</CardTitle>
                <CardDescription>Tax rate on corporate profits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{corporateRate}%</div>
                    <div className="text-sm text-gray-600">Current rate: 21%</div>
                  </div>
                  <Slider
                    value={[corporateRate]}
                    onValueChange={(value) => setCorporateRate(value[0])}
                    min={10}
                    max={40}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span>Current: 21%</span>
                    <span>40%</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">${proposedRevenue.corporate.toFixed(0)}B</div>
                    <div className="text-sm text-gray-600">Projected revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capital Gains Tax Rate</CardTitle>
                <CardDescription>Tax rate on investment gains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{capitalGainsRate}%</div>
                    <div className="text-sm text-gray-600">Current rate: 20%</div>
                  </div>
                  <Slider
                    value={[capitalGainsRate]}
                    onValueChange={(value) => setCapitalGainsRate(value[0])}
                    min={0}
                    max={40}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>Current: 20%</span>
                    <span>40%</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">${proposedRevenue.capitalGains.toFixed(0)}B</div>
                    <div className="text-sm text-gray-600">Projected revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Breakdown of revenue changes by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Individual Income Tax</span>
                    <div className="text-right">
                      <div className="font-bold">${proposedRevenue.individual.toFixed(0)}B</div>
                      <div
                        className={`text-sm ${
                          proposedRevenue.individual > currentRevenue.individual ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {proposedRevenue.individual > currentRevenue.individual ? "+" : ""}
                        {(proposedRevenue.individual - currentRevenue.individual).toFixed(0)}B
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Corporate Tax</span>
                    <div className="text-right">
                      <div className="font-bold">${proposedRevenue.corporate.toFixed(0)}B</div>
                      <div
                        className={`text-sm ${
                          proposedRevenue.corporate > currentRevenue.corporate ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {proposedRevenue.corporate > currentRevenue.corporate ? "+" : ""}
                        {(proposedRevenue.corporate - currentRevenue.corporate).toFixed(0)}B
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Capital Gains</span>
                    <div className="text-right">
                      <div className="font-bold">${proposedRevenue.capitalGains.toFixed(0)}B</div>
                      <div
                        className={`text-sm ${
                          proposedRevenue.capitalGains > currentRevenue.capitalGains ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {proposedRevenue.capitalGains > currentRevenue.capitalGains ? "+" : ""}
                        {(proposedRevenue.capitalGains - currentRevenue.capitalGains).toFixed(0)}B
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Revenue</span>
                      <div className="text-right">
                        <div>${proposedRevenue.total.toFixed(0)}B</div>
                        <div className={`text-sm ${revenueChange > 0 ? "text-green-600" : "text-red-600"}`}>
                          {revenueChange > 0 ? "+" : ""}
                          {revenueChange.toFixed(0)}B ({revenueChangePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Economic Impact Assessment</CardTitle>
                <CardDescription>Estimated effects on economic growth and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">GDP Impact</h4>
                    <p className="text-sm text-blue-800">
                      Estimated {revenueChangePercent > 5 ? "moderate negative" : "minimal"} impact on GDP growth due to
                      tax changes.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Behavioral Effects</h4>
                    <p className="text-sm text-yellow-800">
                      Higher rates may reduce work incentives and increase tax avoidance, especially for top earners.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Progressivity</h4>
                    <p className="text-sm text-green-800">
                      Rate spread of {progressivity.toFixed(1)}% indicates{" "}
                      {progressivity > 25 ? "high" : progressivity > 15 ? "moderate" : "low"} progressivity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>International Tax Rate Comparison</CardTitle>
              <CardDescription>How your proposed rates compare to other developed countries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Top Individual Rate</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(...taxBrackets.map((b) => b.proposedRate))}%
                    </div>
                    <div className="text-sm text-gray-600">Your proposal</div>
                    <div className="text-xs text-gray-500 mt-2">OECD avg: 42.8% • US current: 37%</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Corporate Rate</h4>
                    <div className="text-2xl font-bold text-purple-600">{corporateRate}%</div>
                    <div className="text-sm text-gray-600">Your proposal</div>
                    <div className="text-xs text-gray-500 mt-2">OECD avg: 23.1% • US current: 21%</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Capital Gains Rate</h4>
                    <div className="text-2xl font-bold text-green-600">{capitalGainsRate}%</div>
                    <div className="text-sm text-gray-600">Your proposal</div>
                    <div className="text-xs text-gray-500 mt-2">OECD avg: 18.4% • US current: 20%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Adequacy</CardTitle>
              <CardDescription>How your tax design addresses the federal deficit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">${Math.abs(revenueChange).toFixed(0)}B</div>
                  <div className="text-sm text-gray-600">
                    {revenueChange > 0 ? "Additional" : "Reduced"} annual revenue
                  </div>
                </div>
                <Progress value={Math.min(100, Math.abs(revenueChange / 26.5))} className="h-3" />
                <div className="text-center text-sm text-gray-600">
                  {revenueChange > 0
                    ? `${((revenueChange / 2650) * 100).toFixed(1)}% of current deficit addressed`
                    : `Would increase deficit by ${((Math.abs(revenueChange) / 2650) * 100).toFixed(1)}%`}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
