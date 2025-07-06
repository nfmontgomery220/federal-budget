"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, TrendingDown, Users, Calendar, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Social Security and Medicare data with salient issues
const entitlementData = {
  2024: {
    socialSecurity: {
      totalSpending: 1347000000000, // $1.347T
      percentOfBudget: 20.0,
      beneficiaries: 67000000,
      avgBenefit: 1907, // Monthly
      trustFundBalance: 2788000000000, // $2.788T
      trustFundDepletion: 2034,
      yearsToDepletion: 10,
      automaticCutIfNoAction: 23, // 23% benefit cut
      demographics: {
        currentWorkerToBeneficiaryRatio: 2.8,
        projectedRatio2040: 2.3,
        babyboomersRetiring: 10000, // per day
        lifeExpectancyIncrease: 3.2, // years since 1940
      },
      financialProjections: [
        { year: 2024, income: 1347, expenditures: 1347, balance: 0, trustFund: 2788 },
        { year: 2025, income: 1398, expenditures: 1425, balance: -27, trustFund: 2761 },
        { year: 2030, income: 1654, expenditures: 1789, balance: -135, trustFund: 2088 },
        { year: 2034, income: 1823, expenditures: 2156, balance: -333, trustFund: 0 },
        { year: 2040, income: 2134, expenditures: 2567, balance: -433, trustFund: 0 },
      ],
      reformOptions: [
        {
          name: "Raise Full Retirement Age to 67",
          currentAge: 66.67,
          proposedAge: 67,
          savingsPercent: 13,
          politicalDifficulty: "Medium",
          affectedGenerations: "Born after 1960",
          implementation: "Gradual over 10 years",
        },
        {
          name: "Remove Payroll Tax Cap",
          currentCap: 160200,
          proposedCap: "None",
          savingsPercent: 71,
          politicalDifficulty: "High",
          affectedIncome: ">$160K",
          implementation: "Immediate or phased",
        },
        {
          name: "Increase Payroll Tax Rate",
          currentRate: 12.4,
          proposedRate: 14.4,
          savingsPercent: 100,
          politicalDifficulty: "Very High",
          affectedGroups: "All workers",
          implementation: "Gradual increase",
        },
        {
          name: "Means Testing Benefits",
          currentMeans: "None",
          proposedMeans: "Reduce benefits for high earners",
          savingsPercent: 15,
          politicalDifficulty: "High",
          affectedIncome: ">$100K in retirement",
          implementation: "New retirees only",
        },
        {
          name: "Change COLA Formula",
          currentFormula: "CPI-W",
          proposedFormula: "Chained CPI",
          savingsPercent: 20,
          politicalDifficulty: "Medium",
          annualReduction: "0.3% per year",
          implementation: "Immediate",
        },
      ],
    },
    medicare: {
      totalSpending: 1021000000000, // $1.021T
      percentOfBudget: 15.1,
      beneficiaries: 65000000,
      avgCostPerBeneficiary: 15708, // Annual
      trustFundBalance: 202000000000, // $202B (Part A only)
      trustFundDepletion: 2031,
      yearsToDepletion: 7,
      automaticCutIfNoAction: 11, // 11% provider payment cut
      parts: {
        partA: {
          name: "Hospital Insurance",
          spending: 405000000000,
          fundingSource: "Payroll taxes",
          trustFundStatus: "Depleting",
        },
        partB: {
          name: "Medical Insurance",
          spending: 498000000000,
          fundingSource: "Premiums + General Revenue",
          trustFundStatus: "General Revenue",
        },
        partC: {
          name: "Medicare Advantage",
          spending: 454000000000,
          fundingSource: "Parts A & B",
          trustFundStatus: "Included in A & B",
        },
        partD: {
          name: "Prescription Drugs",
          spending: 118000000000,
          fundingSource: "Premiums + General Revenue",
          trustFundStatus: "General Revenue",
        },
      },
      costDrivers: [
        {
          factor: "Aging Population",
          impact: "High",
          description: "65+ population growing 3.5% annually",
          contribution: 35,
        },
        {
          factor: "Medical Inflation",
          impact: "High",
          description: "Healthcare costs rising faster than general inflation",
          contribution: 30,
        },
        {
          factor: "Prescription Drug Costs",
          impact: "Medium",
          description: "New specialty drugs, biologics",
          contribution: 15,
        },
        {
          factor: "Chronic Disease Prevalence",
          impact: "Medium",
          description: "Diabetes, heart disease, obesity",
          contribution: 12,
        },
        {
          factor: "Technology/Innovation",
          impact: "Medium",
          description: "New treatments, procedures",
          contribution: 8,
        },
      ],
      reformOptions: [
        {
          name: "Raise Medicare Eligibility Age",
          currentAge: 65,
          proposedAge: 67,
          savingsPercent: 5,
          politicalDifficulty: "Very High",
          affectedGroups: "Future retirees",
          implementation: "Gradual over 20 years",
        },
        {
          name: "Increase Medicare Payroll Tax",
          currentRate: 2.9,
          proposedRate: 3.4,
          savingsPercent: 17,
          politicalDifficulty: "High",
          affectedGroups: "All workers",
          implementation: "Immediate",
        },
        {
          name: "Means Test Medicare Benefits",
          currentMeans: "Limited (Part B/D)",
          proposedMeans: "Expand to all parts",
          savingsPercent: 8,
          politicalDifficulty: "High",
          affectedIncome: ">$200K",
          implementation: "New beneficiaries",
        },
        {
          name: "Negotiate All Drug Prices",
          currentScope: "Limited",
          proposedScope: "All Medicare drugs",
          savingsPercent: 12,
          politicalDifficulty: "Medium",
          opposition: "Pharmaceutical industry",
          implementation: "3-year phase-in",
        },
        {
          name: "Provider Payment Reform",
          currentSystem: "Fee-for-service",
          proposedSystem: "Value-based payments",
          savingsPercent: 10,
          politicalDifficulty: "Medium",
          resistance: "Healthcare providers",
          implementation: "5-year transition",
        },
      ],
    },
    combinedChallenges: {
      totalSpending: 2368000000000, // $2.368T
      percentOfBudget: 35.1,
      percentOfGDP: 9.2,
      projectedGDPShare2040: 13.8,
      politicalReality: {
        thirdRail: "Touching benefits is political suicide",
        voterPower: "Seniors vote at highest rates",
        lobbyingPower: "AARP has 38M members",
        congressionalInaction: "No major reforms since 1983",
      },
      intergenerationalEquity: {
        currentRetireeROI: 3.2, // Return on contributions
        futureRetireeROI: 1.8,
        millennialBurden: "Higher taxes, lower benefits",
        genXSqueeze: "Peak earning years during crisis",
      },
      economicImpact: {
        crowdingOut: "Less money for infrastructure, education",
        debtImpact: "Growing share of federal debt",
        taxBurden: "Higher payroll taxes reduce take-home pay",
        laborMarketEffects: "Delayed retirement, workforce participation",
      },
    },
  },
}

// Historical and projected data
const historicalTrends = [
  { year: 1990, ssSpending: 248, medicareSpending: 98, beneficiaries: 39, workerRatio: 3.4 },
  { year: 2000, ssSpending: 409, medicareSpending: 197, beneficiaries: 45, workerRatio: 3.4 },
  { year: 2010, ssSpending: 701, medicareSpending: 451, beneficiaries: 54, workerRatio: 2.9 },
  { year: 2020, ssSpending: 1090, medicareSpending: 769, beneficiaries: 64, workerRatio: 2.8 },
  { year: 2024, ssSpending: 1347, medicareSpending: 1021, beneficiaries: 67, workerRatio: 2.8 },
  { year: 2030, ssSpending: 1789, medicareSpending: 1456, beneficiaries: 77, workerRatio: 2.5 },
  { year: 2040, ssSpending: 2567, medicareSpending: 2234, beneficiaries: 82, workerRatio: 2.3 },
]

interface SocialSecurityMedicareAnalysisProps {
  onBack?: () => void
}

export default function SocialSecurityMedicareAnalysis({ onBack }: SocialSecurityMedicareAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatBillions = (amount: number) => `$${(amount / 1000000000).toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const currentData = entitlementData[2024]

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
                  Back to Dashboard
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Social Security & Medicare Crisis</h1>
            </div>
            <p className="text-gray-600">
              Analysis of America's largest entitlement programs facing demographic and financial challenges
            </p>
          </div>
        </div>

        {/* Crisis Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Impending Crisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">2031</div>
                <div className="text-sm text-red-700">Medicare Trust Fund Depleted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">2034</div>
                <div className="text-sm text-red-700">Social Security Trust Fund Depleted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">23%</div>
                <div className="text-sm text-orange-700">SS Benefit Cut if No Action</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">11%</div>
                <div className="text-sm text-orange-700">Medicare Provider Cut</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social-security">Social Security</TabsTrigger>
            <TabsTrigger value="medicare">Medicare</TabsTrigger>
            <TabsTrigger value="reforms">Reform Options</TabsTrigger>
            <TabsTrigger value="politics">Political Reality</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Spending */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Combined Program Spending
                  </CardTitle>
                  <CardDescription>Social Security + Medicare = 35.1% of federal budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        {formatBillions(currentData.combinedChallenges.totalSpending)}
                      </div>
                      <div className="text-sm text-gray-600">Total Annual Spending</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {formatBillions(currentData.socialSecurity.totalSpending)}
                        </div>
                        <div className="text-sm text-blue-700">Social Security</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {formatBillions(currentData.medicare.totalSpending)}
                        </div>
                        <div className="text-sm text-green-700">Medicare</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographic Challenge */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    The Demographic Challenge
                  </CardTitle>
                  <CardDescription>Aging population straining the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">2.8</div>
                        <div className="text-sm text-orange-700">Workers per Beneficiary</div>
                        <div className="text-xs text-gray-600">Down from 3.4 in 2000</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">2.3</div>
                        <div className="text-sm text-red-700">Projected by 2040</div>
                        <div className="text-xs text-gray-600">Unsustainable ratio</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">10,000</div>
                      <div className="text-sm text-yellow-700">Baby Boomers Retiring Daily</div>
                      <div className="text-xs text-gray-600">Until 2030</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Historical and Projected Spending</CardTitle>
                <CardDescription>Growth trajectory of entitlement spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ssSpending: { label: "Social Security", color: "hsl(var(--chart-1))" },
                    medicareSpending: { label: "Medicare", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalTrends}>
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
                                    {entry.name}: {formatBillions((entry.value as number) * 1000000000)}
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ssSpending"
                        stroke="var(--color-ssSpending)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="medicareSpending"
                        stroke="var(--color-medicareSpending)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Key Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Salient Issues</CardTitle>
                <CardDescription>Critical challenges facing both programs</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Trust Fund Depletion</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Medicare (2031) and Social Security (2034) trust funds face insolvency without reform
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Demographic Shift</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Aging population and declining birth rates create unsustainable worker-to-beneficiary ratios
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Political Paralysis</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    "Third rail" politics prevent necessary reforms, with no major changes since 1983
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Intergenerational Inequity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Younger generations pay more and receive less, creating fairness concerns
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Healthcare Cost Inflation</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Medical costs rising faster than general inflation, especially prescription drugs
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Economic Crowding Out</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Growing entitlement spending leaves less for infrastructure, education, and other priorities
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-security" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SS Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Security Overview</CardTitle>
                  <CardDescription>America's largest social program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">67M</div>
                        <div className="text-sm text-blue-700">Beneficiaries</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">$1,907</div>
                        <div className="text-sm text-green-700">Avg Monthly Benefit</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">20.0%</div>
                      <div className="text-sm text-yellow-700">Of Federal Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Fund Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Trust Fund Depletion
                  </CardTitle>
                  <CardDescription>Path to insolvency without reform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      trustFund: { label: "Trust Fund Balance", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentData.socialSecurity.financialProjections}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm">Trust Fund: {formatBillions(data.trustFund * 1000000000)}</p>
                                  <p className="text-sm">Annual Balance: {formatBillions(data.balance * 1000000000)}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="trustFund"
                          stroke="var(--color-trustFund)"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Demographic Challenges</CardTitle>
                <CardDescription>How population changes affect Social Security</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">2.8</div>
                  <div className="text-sm text-red-700">Current Worker Ratio</div>
                  <div className="text-xs text-gray-600">Workers per beneficiary</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">2.3</div>
                  <div className="text-sm text-orange-700">2040 Projection</div>
                  <div className="text-xs text-gray-600">Declining support</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">10,000</div>
                  <div className="text-sm text-yellow-700">Daily Retirees</div>
                  <div className="text-xs text-gray-600">Baby Boomers</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">+3.2</div>
                  <div className="text-sm text-blue-700">Years Life Expectancy</div>
                  <div className="text-xs text-gray-600">Since 1940</div>
                </div>
              </CardContent>
            </Card>

            {/* Reform Options */}
            <Card>
              <CardHeader>
                <CardTitle>Social Security Reform Options</CardTitle>
                <CardDescription>Potential solutions to address the funding gap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.socialSecurity.reformOptions.map((reform, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reform.name}</h4>
                        <Badge
                          variant={
                            reform.politicalDifficulty === "Very High"
                              ? "destructive"
                              : reform.politicalDifficulty === "High"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {reform.politicalDifficulty} Difficulty
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Savings:</strong> {reform.savingsPercent}% of shortfall
                        </div>
                        <div>
                          <strong>Implementation:</strong> {reform.implementation}
                        </div>
                        <div>
                          <strong>Affected:</strong>{" "}
                          {reform.affectedGenerations || reform.affectedIncome || reform.affectedGroups}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medicare" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medicare Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Medicare Overview</CardTitle>
                  <CardDescription>Healthcare for 65M+ Americans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">65M</div>
                        <div className="text-sm text-blue-700">Beneficiaries</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">$15,708</div>
                        <div className="text-sm text-green-700">Avg Annual Cost</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">15.1%</div>
                      <div className="text-sm text-yellow-700">Of Federal Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medicare Parts */}
              <Card>
                <CardHeader>
                  <CardTitle>Medicare Parts Breakdown</CardTitle>
                  <CardDescription>Four components of Medicare</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(currentData.medicare.parts).map(([key, part]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{part.name}</div>
                          <div className="text-sm text-gray-600">{part.fundingSource}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatBillions(part.spending)}</div>
                          <div className="text-xs text-gray-600">{part.trustFundStatus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Drivers */}
            <Card>
              <CardHeader>
                <CardTitle>Medicare Cost Drivers</CardTitle>
                <CardDescription>What's driving Medicare spending growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    contribution: { label: "Contribution %", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.medicare.costDrivers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="factor" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm">Contribution: {data.contribution}%</p>
                                <p className="text-sm">{data.description}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="contribution" fill="var(--color-contribution)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Medicare Reform Options */}
            <Card>
              <CardHeader>
                <CardTitle>Medicare Reform Options</CardTitle>
                <CardDescription>Potential solutions to control Medicare costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.medicare.reformOptions.map((reform, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reform.name}</h4>
                        <Badge
                          variant={
                            reform.politicalDifficulty === "Very High"
                              ? "destructive"
                              : reform.politicalDifficulty === "High"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {reform.politicalDifficulty} Difficulty
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Savings:</strong> {reform.savingsPercent}% of costs
                        </div>
                        <div>
                          <strong>Implementation:</strong> {reform.implementation}
                        </div>
                        <div>
                          <strong>Affected:</strong>{" "}
                          {reform.affectedGroups || reform.affectedIncome || reform.opposition || reform.resistance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reforms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Reform Scenarios</CardTitle>
                <CardDescription>Combined approaches to address both programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-green-700">Gradual Reform Package</h3>
                    <div className="space-y-3 text-sm">
                      <div>• Raise retirement age to 67 over 10 years</div>
                      <div>• Increase payroll tax cap gradually</div>
                      <div>• Change COLA to chained CPI</div>
                      <div>• Expand Medicare drug negotiations</div>
                      <div>• Implement value-based payments</div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <div className="font-medium">Impact:</div>
                      <div className="text-sm">Solves 75% of shortfall over 20 years</div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-blue-700">Revenue-Focused Package</h3>
                    <div className="space-y-3 text-sm">
                      <div>• Remove payroll tax cap entirely</div>
                      <div>• Increase Medicare payroll tax</div>
                      <div>• Expand means testing</div>
                      <div>• Higher Medicare premiums for wealthy</div>
                      <div>• New tax on high earners</div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <div className="font-medium">Impact:</div>
                      <div className="text-sm">Solves 90% of shortfall, higher taxes</div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-orange-700">Benefit-Focused Package</h3>
                    <div className="space-y-3 text-sm">
                      <div>• Raise Medicare eligibility to 67</div>
                      <div>• Means test all benefits</div>
                      <div>• Reduce benefits for high earners</div>
                      <div>• Slower benefit growth</div>
                      <div>• Higher out-of-pocket costs</div>
                    </div>
                    <div className="mt-4 p-3 bg-orange-50 rounded">
                      <div className="font-medium">Impact:</div>
                      <div className="text-sm">Solves 80% of shortfall, lower benefits</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reform Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
                <CardDescription>Realistic schedule for major reforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium">2025-2027: Crisis Recognition</div>
                      <div className="text-sm text-gray-600">
                        Political pressure builds as trust fund depletion approaches
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">2028-2030: Legislative Action</div>
                      <div className="text-sm text-gray-600">
                        Congress forced to act as Medicare trust fund nears depletion
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">2031-2034: Implementation</div>
                      <div className="text-sm text-gray-600">Gradual phase-in of reforms to minimize disruption</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">2035+: Long-term Stability</div>
                      <div className="text-sm text-gray-600">Programs stabilized with sustainable financing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="politics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Political Reality Check</CardTitle>
                <CardDescription>Why entitlement reform is so difficult</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">The "Third Rail" Problem</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-900">Electoral Suicide</div>
                      <div className="text-sm text-red-700">Politicians who touch benefits often lose elections</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-900">Senior Voting Power</div>
                      <div className="text-sm text-orange-700">
                        65+ voters have highest turnout rates (70%+ vs 50% overall)
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-900">AARP Influence</div>
                      <div className="text-sm text-yellow-700">38 million members, massive lobbying power</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Congressional Inaction</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">Last Major Reform: 1983</div>
                      <div className="text-sm text-blue-700">41 years since significant Social Security changes</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-900">Partisan Divide</div>
                      <div className="text-sm text-purple-700">
                        Republicans favor benefit cuts, Democrats favor tax increases
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">Kicking the Can</div>
                      <div className="text-sm text-green-700">Each Congress hopes the next will deal with it</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intergenerational Equity */}
            <Card>
              <CardHeader>
                <CardTitle>Intergenerational Equity Crisis</CardTitle>
                <CardDescription>How different generations are affected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Current Retirees</h4>
                    <div className="text-2xl font-bold text-green-600">3.2x</div>
                    <div className="text-sm text-green-700">Return on contributions</div>
                    <div className="text-xs text-gray-600">Best deal in history</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Baby Boomers</h4>
                    <div className="text-2xl font-bold text-yellow-600">2.4x</div>
                    <div className="text-sm text-yellow-700">Return on contributions</div>
                    <div className="text-xs text-gray-600">Still positive</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Gen X</h4>
                    <div className="text-2xl font-bold text-orange-600">2.0x</div>
                    <div className="text-sm text-orange-700">Return on contributions</div>
                    <div className="text-xs text-gray-600">Peak earning during crisis</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900">Millennials</h4>
                    <div className="text-2xl font-bold text-red-600">1.8x</div>
                    <div className="text-sm text-red-700">Return on contributions</div>
                    <div className="text-xs text-gray-600">Worst deal, highest burden</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economic Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Broader Economic Impact</CardTitle>
                <CardDescription>How entitlement spending affects the economy</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Crowding Out Effect</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Growing entitlement spending leaves less for infrastructure, education, and defense
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Debt Burden</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Entitlements drive long-term debt growth, threatening fiscal sustainability
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Labor Market Effects</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Higher payroll taxes reduce take-home pay and may discourage work
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
