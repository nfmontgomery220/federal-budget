"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
  Zap,
  Globe,
  Calculator,
  AlertTriangle,
} from "lucide-react"

interface RevenueSource {
  id: string
  name: string
  amount: number
  percentage: number
  category: string
  description: string
  icon: any
  trend: "up" | "down" | "stable"
  trendValue: number
  efficiency: "High" | "Medium" | "Low"
  politicalFeasibility: "High" | "Medium" | "Low"
}

const revenueData2025: RevenueSource[] = [
  {
    id: "individual-income",
    name: "Individual Income Tax",
    amount: 2044,
    percentage: 44.9,
    category: "Income Taxes",
    description: "Personal income tax from wages, salaries, and investments",
    icon: Users,
    trend: "up",
    trendValue: 3.2,
    efficiency: "High",
    politicalFeasibility: "Medium",
  },
  {
    id: "payroll",
    name: "Payroll Taxes",
    amount: 1484,
    percentage: 32.6,
    category: "Payroll Taxes",
    description: "Social Security and Medicare taxes on wages",
    icon: Users,
    trend: "up",
    trendValue: 2.8,
    efficiency: "High",
    politicalFeasibility: "Low",
  },
  {
    id: "corporate",
    name: "Corporate Income Tax",
    amount: 420,
    percentage: 9.2,
    category: "Corporate Taxes",
    description: "Tax on corporate profits and business income",
    icon: Building,
    trend: "down",
    trendValue: -1.5,
    efficiency: "Medium",
    politicalFeasibility: "High",
  },
  {
    id: "customs",
    name: "Customs Duties",
    amount: 95,
    percentage: 2.1,
    category: "Trade Taxes",
    description: "Tariffs and duties on imported goods",
    icon: Globe,
    trend: "up",
    trendValue: 15.2,
    efficiency: "Low",
    politicalFeasibility: "Medium",
  },
  {
    id: "estate",
    name: "Estate & Gift Tax",
    amount: 33,
    percentage: 0.7,
    category: "Wealth Taxes",
    description: "Tax on large inheritances and gifts",
    icon: DollarSign,
    trend: "stable",
    trendValue: 0.1,
    efficiency: "Low",
    politicalFeasibility: "Low",
  },
  {
    id: "excise",
    name: "Excise Taxes",
    amount: 65,
    percentage: 1.4,
    category: "Consumption Taxes",
    description: "Taxes on gasoline, alcohol, tobacco, and other goods",
    icon: Zap,
    trend: "down",
    trendValue: -2.1,
    efficiency: "Medium",
    politicalFeasibility: "Medium",
  },
  {
    id: "other",
    name: "Other Revenue",
    amount: 409,
    percentage: 9.0,
    category: "Other",
    description: "Federal Reserve earnings, fees, fines, and miscellaneous",
    icon: Calculator,
    trend: "stable",
    trendValue: 0.5,
    efficiency: "Medium",
    politicalFeasibility: "High",
  },
]

const potentialNewRevenue = [
  {
    id: "carbon-tax",
    name: "Carbon Tax",
    potential: 180,
    description: "$50/ton CO2 tax on fossil fuels",
    difficulty: "High",
    timeframe: "2-3 years",
  },
  {
    id: "financial-transaction",
    name: "Financial Transaction Tax",
    potential: 75,
    description: "0.1% tax on stock trades",
    difficulty: "Medium",
    timeframe: "1-2 years",
  },
  {
    id: "digital-services",
    name: "Digital Services Tax",
    potential: 45,
    description: "Tax on tech company revenues",
    difficulty: "Medium",
    timeframe: "1-2 years",
  },
  {
    id: "wealth-tax",
    name: "Wealth Tax",
    potential: 120,
    description: "2% annual tax on wealth over $50M",
    difficulty: "High",
    timeframe: "3-5 years",
  },
  {
    id: "vat",
    name: "Value Added Tax",
    potential: 400,
    description: "10% VAT on goods and services",
    difficulty: "High",
    timeframe: "3-5 years",
  },
]

export default function RevenueBreakdown() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const totalRevenue = revenueData2025.reduce((sum, item) => sum + item.amount, 0)
  const totalPotentialNew = potentialNewRevenue.reduce((sum, item) => sum + item.potential, 0)

  const filteredData =
    selectedCategory === "all" ? revenueData2025 : revenueData2025.filter((item) => item.category === selectedCategory)

  const categories = [...new Set(revenueData2025.map((item) => item.category))]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Federal Revenue Breakdown</h1>
        <p className="text-gray-600">Detailed analysis of federal revenue sources and potential new revenue streams</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(2)}T</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Largest Source</p>
                <p className="text-2xl font-bold text-gray-900">Individual Income</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">{revenueData2025[0].percentage}% of total revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+2.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">Average annual growth</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Revenue Potential</p>
                <p className="text-2xl font-bold text-gray-900">${(totalPotentialNew / 1000).toFixed(1)}T</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">From new tax sources</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Revenue</TabsTrigger>
          <TabsTrigger value="potential">New Revenue Sources</TabsTrigger>
          <TabsTrigger value="analysis">Comparative Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4">
            {filteredData.map((source) => {
              const Icon = source.icon
              return (
                <Card key={source.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <CardDescription className="text-sm">{source.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${source.amount.toLocaleString()}B</div>
                        <div className="text-sm text-gray-600">{source.percentage}% of total</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={source.percentage} className="h-2" />

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {source.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              source.efficiency === "High"
                                ? "border-green-300 text-green-700"
                                : source.efficiency === "Medium"
                                  ? "border-yellow-300 text-yellow-700"
                                  : "border-red-300 text-red-700"
                            }`}
                          >
                            {source.efficiency} Efficiency
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              source.politicalFeasibility === "High"
                                ? "border-green-300 text-green-700"
                                : source.politicalFeasibility === "Medium"
                                  ? "border-yellow-300 text-yellow-700"
                                  : "border-red-300 text-red-700"
                            }`}
                          >
                            {source.politicalFeasibility} Political Feasibility
                          </Badge>
                        </div>

                        <div
                          className={`flex items-center gap-1 text-sm ${
                            source.trend === "up"
                              ? "text-green-600"
                              : source.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {source.trend === "up" && <TrendingUp className="h-3 w-3" />}
                          {source.trend === "down" && <TrendingDown className="h-3 w-3" />}
                          {source.trend === "up" ? "+" : source.trend === "down" ? "" : "±"}
                          {source.trendValue}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="potential" className="space-y-4">
          <Card className="border-orange-200 bg-orange-50 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Potential New Revenue Sources</span>
              </div>
              <p className="text-sm text-orange-800">
                These are potential new revenue sources that could help close the deficit. Implementation difficulty and
                timeframes vary significantly.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {potentialNewRevenue.map((source, index) => (
              <Card key={source.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <CardDescription className="text-sm">{source.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+${source.potential.toLocaleString()}B</div>
                      <div className="text-sm text-gray-600">Annual potential</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          source.difficulty === "Low"
                            ? "border-green-300 text-green-700"
                            : source.difficulty === "Medium"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-red-300 text-red-700"
                        }`}
                      >
                        {source.difficulty} Difficulty
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {source.timeframe} implementation
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {((source.potential / totalRevenue) * 100).toFixed(1)}% of current revenue
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  Total Potential: ${(totalPotentialNew / 1000).toFixed(1)}T
                </div>
                <p className="text-sm text-blue-800">
                  Combined, these new revenue sources could generate enough to significantly reduce or eliminate the
                  current deficit, though political and economic challenges would be substantial.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Efficiency Analysis</CardTitle>
                <CardDescription>Cost of collection vs. revenue generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Individual Income Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="w-20 h-2" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payroll Taxes</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Corporate Income Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-20 h-2" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estate & Gift Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Comparison</CardTitle>
                <CardDescription>US tax revenue as % of GDP vs. other countries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">France</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm font-medium">45.4%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Germany</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20 h-2" />
                      <span className="text-sm font-medium">39.3%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">United Kingdom</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20 h-2" />
                      <span className="text-sm font-medium">33.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">United States</span>
                    <div className="flex items-center gap-2">
                      <Progress value={55} className="w-20 h-2" />
                      <span className="text-sm font-medium">27.1%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  The US has significant room to increase tax revenue compared to other developed nations.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
