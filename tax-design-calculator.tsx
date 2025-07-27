"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, TrendingUp, Users, Building2, Target, ArrowLeft } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"

interface TaxDesignCalculatorProps {
  onBack?: () => void
}

export default function TaxDesignCalculator({ onBack }: TaxDesignCalculatorProps) {
  const [activeTab, setActiveTab] = useState("income")

  // Tax bracket settings
  const [incomeTaxRates, setIncomeTaxRates] = useState({
    bracket1: { min: 0, max: 11000, rate: 10 },
    bracket2: { min: 11000, max: 44725, rate: 12 },
    bracket3: { min: 44725, max: 95375, rate: 22 },
    bracket4: { min: 95375, max: 182050, rate: 24 },
    bracket5: { min: 182050, max: 231250, rate: 32 },
    bracket6: { min: 231250, max: 578125, rate: 35 },
    bracket7: { min: 578125, max: Number.POSITIVE_INFINITY, rate: 37 },
  })

  const [corporateRate, setCorporateRate] = useState([21])
  const [capitalGainsRate, setCapitalGainsRate] = useState([20])
  const [payrollTaxCap, setPayrollTaxCap] = useState([160200])
  const [estateTaxRate, setEstateTaxRate] = useState([40])
  const [estateTaxExemption, setEstateTaxExemption] = useState([12920000])

  // New tax proposals
  const [wealthTaxRate, setWealthTaxRate] = useState([2])
  const [wealthTaxThreshold, setWealthTaxThreshold] = useState([50000000])
  const [carbonTaxRate, setCarbonTaxRate] = useState([50])
  const [financialTransactionTax, setFinancialTransactionTax] = useState([0.1])

  const calculateRevenue = () => {
    // Simplified revenue calculations
    const individualIncome = 2044 * (1 + (incomeTaxRates.bracket7.rate - 37) / 100)
    const corporateIncome = 420 * (corporateRate[0] / 21)
    const capitalGains = 200 * (capitalGainsRate[0] / 20)
    const payrollTax = 1614 * (payrollTaxCap[0] / 160200)
    const estateTax = 28 * (estateTaxRate[0] / 40)

    // New revenue sources
    const wealthTax = wealthTaxRate[0] * 10 // Simplified calculation
    const carbonTax = carbonTaxRate[0] * 6 // Simplified calculation
    const transactionTax = financialTransactionTax[0] * 1000 // Simplified calculation

    return {
      individualIncome,
      corporateIncome,
      capitalGains,
      payrollTax,
      estateTax,
      wealthTax,
      carbonTax,
      transactionTax,
      total:
        individualIncome +
        corporateIncome +
        capitalGains +
        payrollTax +
        estateTax +
        wealthTax +
        carbonTax +
        transactionTax,
    }
  }

  const revenue = calculateRevenue()

  const revenueData = [
    { name: "Individual Income", current: 2044, proposed: revenue.individualIncome },
    { name: "Corporate Income", current: 420, proposed: revenue.corporateIncome },
    { name: "Capital Gains", current: 200, proposed: revenue.capitalGains },
    { name: "Payroll Tax", current: 1614, proposed: revenue.payrollTax },
    { name: "Estate Tax", current: 28, proposed: revenue.estateTax },
    { name: "Wealth Tax", current: 0, proposed: revenue.wealthTax },
    { name: "Carbon Tax", current: 0, proposed: revenue.carbonTax },
    { name: "Transaction Tax", current: 0, proposed: revenue.transactionTax },
  ]

  const impactData = [
    { income: "$0-50k", currentRate: 8.2, proposedRate: 8.5, impact: 0.3 },
    { income: "$50k-100k", currentRate: 13.8, proposedRate: 14.2, impact: 0.4 },
    { income: "$100k-200k", currentRate: 18.5, proposedRate: 19.1, impact: 0.6 },
    { income: "$200k-500k", currentRate: 24.2, proposedRate: 25.8, impact: 1.6 },
    { income: "$500k-1M", currentRate: 28.9, proposedRate: 31.4, impact: 2.5 },
    { income: "$1M+", currentRate: 31.2, proposedRate: 35.7, impact: 4.5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Tax Design Calculator</h1>
            <p className="text-muted-foreground">Design and analyze optimal tax policies for revenue generation</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Revenue: ${revenue.total.toFixed(0)}B
        </Badge>
      </div>

      {/* Revenue Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${revenue.total.toFixed(0)}B</p>
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
                <p className="text-2xl font-bold">+${(revenue.total - 4306).toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">vs. Baseline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-muted-foreground">From Top 10%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">18.9%</p>
                <p className="text-sm text-muted-foreground">% of GDP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income">Income Tax</TabsTrigger>
          <TabsTrigger value="corporate">Corporate & Capital</TabsTrigger>
          <TabsTrigger value="new">New Revenue</TabsTrigger>
          <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Income Tax Brackets</CardTitle>
              <CardDescription>Adjust tax rates for different income levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(incomeTaxRates).map(([key, bracket]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">
                      ${bracket.min.toLocaleString()} -{" "}
                      {bracket.max === Number.POSITIVE_INFINITY ? "∞" : `$${bracket.max.toLocaleString()}`}
                    </Label>
                    <Badge variant="outline">{bracket.rate}%</Badge>
                  </div>
                  <Slider
                    value={[bracket.rate]}
                    onValueChange={(value) => {
                      setIncomeTaxRates((prev) => ({
                        ...prev,
                        [key]: { ...bracket, rate: value[0] },
                      }))
                    }}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span>
                      Current:{" "}
                      {key === "bracket1"
                        ? 10
                        : key === "bracket2"
                          ? 12
                          : key === "bracket3"
                            ? 22
                            : key === "bracket4"
                              ? 24
                              : key === "bracket5"
                                ? 32
                                : key === "bracket6"
                                  ? 35
                                  : 37}
                      %
                    </span>
                    <span>50%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Tax Settings</CardTitle>
              <CardDescription>Social Security and Medicare tax parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Social Security Tax Cap</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={payrollTaxCap}
                    onValueChange={setPayrollTaxCap}
                    max={500000}
                    min={100000}
                    step={10000}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="min-w-[100px]">
                    ${payrollTaxCap[0].toLocaleString()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current cap: $160,200. Raising the cap increases revenue from high earners.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Corporate Income Tax</CardTitle>
                <CardDescription>Tax rate on business profits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Corporate Tax Rate</Label>
                    <Badge variant="outline">{corporateRate[0]}%</Badge>
                  </div>
                  <Slider
                    value={corporateRate}
                    onValueChange={setCorporateRate}
                    max={35}
                    min={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>15%</span>
                    <span>Current: 21%</span>
                    <span>35%</span>
                  </div>
                </div>
                <Alert>
                  <Building2 className="h-4 w-4" />
                  <AlertDescription>
                    Higher rates increase revenue but may reduce business investment and competitiveness.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capital Gains Tax</CardTitle>
                <CardDescription>Tax on investment profits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Long-term Capital Gains Rate</Label>
                    <Badge variant="outline">{capitalGainsRate[0]}%</Badge>
                  </div>
                  <Slider
                    value={capitalGainsRate}
                    onValueChange={setCapitalGainsRate}
                    max={40}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span>Current: 20%</span>
                    <span>40%</span>
                  </div>
                </div>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Affects investment behavior and retirement savings. Higher rates may reduce market activity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estate Tax</CardTitle>
              <CardDescription>Tax on large inheritances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Estate Tax Rate</Label>
                    <Badge variant="outline">{estateTaxRate[0]}%</Badge>
                  </div>
                  <Slider
                    value={estateTaxRate}
                    onValueChange={setEstateTaxRate}
                    max={55}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Exemption Amount</Label>
                    <Badge variant="outline">${(estateTaxExemption[0] / 1000000).toFixed(1)}M</Badge>
                  </div>
                  <Slider
                    value={estateTaxExemption}
                    onValueChange={setEstateTaxExemption}
                    max={25000000}
                    min={1000000}
                    step={500000}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wealth Tax</CardTitle>
                <CardDescription>Annual tax on net worth above threshold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Wealth Tax Rate</Label>
                    <Badge variant="outline">{wealthTaxRate[0]}%</Badge>
                  </div>
                  <Slider
                    value={wealthTaxRate}
                    onValueChange={setWealthTaxRate}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Threshold</Label>
                    <Badge variant="outline">${(wealthTaxThreshold[0] / 1000000).toFixed(0)}M</Badge>
                  </div>
                  <Slider
                    value={wealthTaxThreshold}
                    onValueChange={setWealthTaxThreshold}
                    max={100000000}
                    min={10000000}
                    step={5000000}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated revenue: ${revenue.wealthTax.toFixed(0)}B annually
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Tax</CardTitle>
                <CardDescription>Tax on carbon emissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Carbon Tax Rate</Label>
                    <Badge variant="outline">${carbonTaxRate[0]}/ton CO₂</Badge>
                  </div>
                  <Slider
                    value={carbonTaxRate}
                    onValueChange={setCarbonTaxRate}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated revenue: ${revenue.carbonTax.toFixed(0)}B annually
                </p>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Reduces emissions while generating revenue. May increase energy costs for consumers.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Transaction Tax</CardTitle>
              <CardDescription>Small tax on stock, bond, and derivative trades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Transaction Tax Rate</Label>
                  <Badge variant="outline">{financialTransactionTax[0]}%</Badge>
                </div>
                <Slider
                  value={financialTransactionTax}
                  onValueChange={setFinancialTransactionTax}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated revenue: ${revenue.transactionTax.toFixed(0)}B annually
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Comparison</CardTitle>
                <CardDescription>Current vs. proposed revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(0)}B`} />
                    <Bar dataKey="current" fill="#94a3b8" name="Current" />
                    <Bar dataKey="proposed" fill="#3b82f6" name="Proposed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Burden by Income</CardTitle>
                <CardDescription>Effective tax rates across income levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="income" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Line type="monotone" dataKey="currentRate" stroke="#94a3b8" name="Current Rate" />
                    <Line type="monotone" dataKey="proposedRate" stroke="#3b82f6" name="Proposed Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Policy Impact Summary</CardTitle>
              <CardDescription>Key effects of your tax design</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">Revenue Effects</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Total revenue: ${revenue.total.toFixed(0)}B</li>
                    <li>• Increase: +${(revenue.total - 4306).toFixed(0)}B</li>
                    <li>
                      • New sources: ${(revenue.wealthTax + revenue.carbonTax + revenue.transactionTax).toFixed(0)}B
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600">Distributional Effects</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Progressive structure maintained</li>
                    <li>• Top 1% effective rate: ~36%</li>
                    <li>• Middle class impact: minimal</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-600">Economic Considerations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Investment incentives affected</li>
                    <li>• Carbon reduction benefits</li>
                    <li>• Administrative complexity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
