"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { trackInteraction } from "@/lib/budget-analytics"
import { useRouter } from "next/navigation"

// Income brackets and their current tax rates
const incomeBrackets = [
  { name: "$0 - $10,000", rate: 10, income: 10000, population: 28000000 },
  { name: "$10,001 - $41,775", rate: 12, income: 41775, population: 53000000 },
  { name: "$41,776 - $89,075", rate: 22, income: 89075, population: 35000000 },
  { name: "$89,076 - $170,050", rate: 24, income: 170050, population: 18000000 },
  { name: "$170,051 - $215,950", rate: 32, income: 215950, population: 8000000 },
  { name: "$215,951 - $539,900", rate: 35, income: 539900, population: 5000000 },
  { name: "Over $539,900", rate: 37, income: 1000000, population: 3000000 },
]

// Pre-defined tax policies
const taxPolicies = {
  current: {
    name: "Current System",
    description: "The current progressive tax system with 7 brackets from 10% to 37%",
    rates: [10, 12, 22, 24, 32, 35, 37],
  },
  flat: {
    name: "Flat Tax",
    description: "A single tax rate of 20% applied to all income brackets",
    rates: [20, 20, 20, 20, 20, 20, 20],
  },
  progressive: {
    name: "More Progressive",
    description: "Lower rates for lower incomes, higher rates for higher incomes",
    rates: [5, 10, 15, 25, 35, 40, 45],
  },
  regressive: {
    name: "More Regressive",
    description: "Higher rates for lower incomes, lower rates for higher incomes",
    rates: [25, 22, 20, 18, 15, 12, 10],
  },
  custom: {
    name: "Custom",
    description: "Design your own tax rates for each income bracket",
    rates: [10, 12, 22, 24, 32, 35, 37], // Start with current rates
  },
}

export default function IncomeBracketImpactAnalyzer() {
  const router = useRouter()
  const [selectedPolicy, setSelectedPolicy] = useState("current")
  const [customRates, setCustomRates] = useState([...taxPolicies.current.rates])
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Generate a simple session ID for tracking
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)

    // Track page view
    trackInteraction(newSessionId, "page_view", "income_impact_analyzer")
  }, [])

  const handlePolicyChange = (policy: string) => {
    setSelectedPolicy(policy)
    if (policy !== "custom") {
      setCustomRates([...taxPolicies[policy as keyof typeof taxPolicies].rates])
    }

    // Track policy selection
    if (sessionId) {
      trackInteraction(sessionId, "select_policy", policy)
    }
  }

  const handleRateChange = (index: number, value: number[]) => {
    const newRates = [...customRates]
    newRates[index] = value[0]
    setCustomRates(newRates)

    // Track rate change
    if (sessionId) {
      trackInteraction(sessionId, "adjust_rate", `bracket_${index}`, value[0].toString())
    }
  }

  const calculateTaxRevenue = (rates: number[]) => {
    return incomeBrackets.reduce((total, bracket, index) => {
      const effectiveIncome = bracket.income * bracket.population
      return total + (effectiveIncome * rates[index]) / 100
    }, 0)
  }

  const currentRevenue = calculateTaxRevenue(taxPolicies.current.rates)
  const selectedRevenue = calculateTaxRevenue(
    selectedPolicy === "custom" ? customRates : taxPolicies[selectedPolicy as keyof typeof taxPolicies].rates,
  )
  const revenueDifference = selectedRevenue - currentRevenue
  const percentChange = (revenueDifference / currentRevenue) * 100

  const getChartData = () => {
    const rates =
      selectedPolicy === "custom" ? customRates : taxPolicies[selectedPolicy as keyof typeof taxPolicies].rates
    return incomeBrackets.map((bracket, index) => ({
      name: bracket.name,
      "Current Rate": taxPolicies.current.rates[index],
      "Selected Rate": rates[index],
    }))
  }

  const getRevenueData = () => {
    return [
      {
        name: "Tax Revenue",
        Current: (currentRevenue / 1e12).toFixed(2),
        Selected: (selectedRevenue / 1e12).toFixed(2),
      },
    ]
  }

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (Math.abs(value) >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    } else {
      return `$${value.toFixed(2)}`
    }
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF or CSV
    alert("Download functionality would be implemented here")

    // Track download
    if (sessionId) {
      trackInteraction(sessionId, "download_report", selectedPolicy)
    }
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Share functionality would be implemented here")

    // Track share
    if (sessionId) {
      trackInteraction(sessionId, "share_analysis", selectedPolicy)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBackToHome} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Income Bracket Impact Analysis</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tax Policy Comparison</CardTitle>
            <CardDescription>Compare different tax policies and their impact on revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="policy" className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="policy">Policy Selection</TabsTrigger>
                <TabsTrigger value="custom">Custom Rates</TabsTrigger>
              </TabsList>

              <TabsContent value="policy" className="space-y-4">
                <div>
                  <Label htmlFor="tax-policy">Select Tax Policy</Label>
                  <Select value={selectedPolicy} onValueChange={handlePolicyChange}>
                    <SelectTrigger id="tax-policy" className="mt-2">
                      <SelectValue placeholder="Select a tax policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(taxPolicies).map(([key, policy]) => (
                        <SelectItem key={key} value={key}>
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    {taxPolicies[selectedPolicy as keyof typeof taxPolicies].description}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-4">Tax Rates by Income Bracket</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Tax Rate (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value}%`]} />
                      <Legend />
                      <Bar dataKey="Current Rate" fill="#94a3b8" name="Current System" />
                      <Bar dataKey="Selected Rate" fill="#0ea5e9" name="Selected Policy" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Adjust the tax rates for each income bracket to create your custom tax policy.
                  </p>
                  {incomeBrackets.map((bracket, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <Label>{bracket.name}</Label>
                        <span className="font-medium text-blue-600">{customRates[index]}%</span>
                      </div>
                      <Slider
                        value={[customRates[index]]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={(value) => handleRateChange(index, value)}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setSelectedPolicy("custom")
                      if (sessionId) {
                        trackInteraction(sessionId, "save_custom_rates", "custom")
                      }
                    }}
                    className="w-full mt-4"
                  >
                    Apply Custom Rates
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Impact</CardTitle>
            <CardDescription>Projected changes in tax revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Total Revenue</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Current System</div>
                    <div className="text-2xl font-bold">{formatCurrency(currentRevenue)}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Selected Policy</div>
                    <div className="text-2xl font-bold">{formatCurrency(selectedRevenue)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Revenue Change</h3>
                <div
                  className={`p-4 rounded-lg ${
                    revenueDifference > 0 ? "bg-green-50" : revenueDifference < 0 ? "bg-red-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Difference</span>
                    <span
                      className={`font-medium ${
                        revenueDifference > 0
                          ? "text-green-600"
                          : revenueDifference < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {revenueDifference > 0 ? "+" : ""}
                      {formatCurrency(revenueDifference)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Percent Change</span>
                    <span
                      className={`font-medium ${
                        percentChange > 0 ? "text-green-600" : percentChange < 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {percentChange > 0 ? "+" : ""}
                      {percentChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Revenue Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getRevenueData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Trillions ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`$${value}T`]} />
                    <Legend />
                    <Bar dataKey="Current" fill="#94a3b8" name="Current System" />
                    <Bar dataKey="Selected" fill="#0ea5e9" name="Selected Policy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDownload} className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Distributional Impact</CardTitle>
          <CardDescription>How different income groups are affected by the selected tax policy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Tax Burden by Income Group</h3>
              <div className="space-y-4">
                {incomeBrackets.map((bracket, index) => {
                  const currentRate = taxPolicies.current.rates[index]
                  const selectedRate =
                    selectedPolicy === "custom"
                      ? customRates[index]
                      : taxPolicies[selectedPolicy as keyof typeof taxPolicies].rates[index]
                  const difference = selectedRate - currentRate

                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-1/3">
                        <div className="font-medium">{bracket.name}</div>
                        <div className="text-sm text-gray-500">{(bracket.population / 1000000).toFixed(1)}M people</div>
                      </div>
                      <div className="w-1/3 text-center">
                        <div className="text-sm text-gray-500">Current: {currentRate}%</div>
                        <div className="font-medium">New: {selectedRate}%</div>
                      </div>
                      <div className="w-1/3 text-right">
                        <div
                          className={`font-medium ${
                            difference > 0 ? "text-red-600" : difference < 0 ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {difference > 0 ? "+" : ""}
                          {difference}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {difference > 0 ? "Higher" : difference < 0 ? "Lower" : "No change"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">Revenue Impact</h4>
                  <p className="text-sm text-gray-600">
                    {revenueDifference > 0
                      ? `This policy would increase federal revenue by ${formatCurrency(
                          revenueDifference,
                        )}, which could help reduce the deficit or fund new programs.`
                      : revenueDifference < 0
                        ? `This policy would decrease federal revenue by ${formatCurrency(
                            Math.abs(revenueDifference),
                          )}, which would require spending cuts or increased borrowing.`
                        : "This policy would have a neutral impact on federal revenue."}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium">Progressivity Analysis</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPolicy === "progressive"
                      ? "This policy is more progressive than the current system, placing a higher tax burden on higher income brackets."
                      : selectedPolicy === "regressive"
                        ? "This policy is more regressive than the current system, placing a higher tax burden on lower income brackets."
                        : selectedPolicy === "flat"
                          ? "This flat tax policy treats all income brackets equally, but may have regressive effects in practice."
                          : "This policy has a mixed impact on progressivity compared to the current system."}
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium">Economic Considerations</h4>
                  <p className="text-sm text-gray-600">
                    Changes in tax policy can affect economic behavior, including work incentives, investment decisions,
                    and consumption patterns. These second-order effects are not captured in this simple analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
