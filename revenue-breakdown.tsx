"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { DollarSign, TrendingUp, Users, Calculator, Info } from "lucide-react"

const currentRevenue = [
  { category: "Individual Income Tax", amount: 2044, percentage: 44.9, color: "#3b82f6" },
  { category: "Payroll Tax", amount: 1614, percentage: 35.5, color: "#10b981" },
  { category: "Corporate Income Tax", amount: 420, percentage: 9.2, color: "#f59e0b" },
  { category: "Customs Duties", amount: 80, percentage: 1.8, color: "#ef4444" },
  { category: "Estate & Gift Tax", amount: 33, percentage: 0.7, color: "#8b5cf6" },
  { category: "Excise Tax", amount: 65, percentage: 1.4, color: "#06b6d4" },
  { category: "Other", amount: 294, percentage: 6.5, color: "#6b7280" },
]

const historicalTrends = [
  { year: 2020, individual: 1609, payroll: 1310, corporate: 212, other: 369 },
  { year: 2021, individual: 2044, payroll: 1366, corporate: 372, other: 418 },
  { year: 2022, individual: 2048, payroll: 1484, corporate: 425, other: 443 },
  { year: 2023, individual: 2042, payroll: 1614, corporate: 420, other: 474 },
  { year: 2024, individual: 2044, payroll: 1614, corporate: 420, other: 472 },
]

const revenueBySource = [
  { source: "Wages & Salaries", amount: 1850, growth: 3.2, efficiency: 95 },
  { source: "Capital Gains", amount: 194, growth: -12.5, efficiency: 78 },
  { source: "Social Security", amount: 1347, growth: 5.1, efficiency: 99 },
  { source: "Medicare", amount: 267, growth: 4.8, efficiency: 98 },
  { source: "Corporate Profits", amount: 420, growth: -1.2, efficiency: 65 },
  { source: "Import Duties", amount: 80, growth: 8.3, efficiency: 88 },
]

const stateContributions = [
  { state: "California", amount: 594, percentage: 13.1 },
  { state: "New York", amount: 367, percentage: 8.1 },
  { state: "Texas", amount: 312, percentage: 6.9 },
  { state: "Florida", amount: 198, percentage: 4.4 },
  { state: "Illinois", amount: 156, percentage: 3.4 },
  { state: "New Jersey", amount: 134, percentage: 2.9 },
  { state: "Pennsylvania", amount: 128, percentage: 2.8 },
  { state: "Ohio", amount: 98, percentage: 2.2 },
  { state: "Georgia", amount: 89, percentage: 2.0 },
  { state: "North Carolina", amount: 87, percentage: 1.9 },
]

export default function RevenueBreakdown() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const totalRevenue = currentRevenue.reduce((sum, item) => sum + item.amount, 0)

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}B`
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Federal Revenue Breakdown</h1>
        <p className="text-lg text-gray-600">
          Comprehensive analysis of federal revenue sources and collection efficiency
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">YoY Growth</p>
                <p className="text-2xl font-bold text-blue-600">+2.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Per Capita</p>
                <p className="text-2xl font-bold text-purple-600">$13,750</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-orange-600">87.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
          <TabsTrigger value="states">State Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Composition Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Composition</CardTitle>
                <CardDescription>Breakdown by major tax categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {currentRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Categories</CardTitle>
                <CardDescription>Detailed breakdown with amounts and percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRevenue.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-medium text-gray-900">{item.category}</p>
                          <p className="text-sm text-gray-600">{formatPercent(item.percentage)} of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Revenue Trends</CardTitle>
              <CardDescription>Revenue by category over the past 5 years</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value}B`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="individual"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="Individual Income Tax"
                  />
                  <Area
                    type="monotone"
                    dataKey="payroll"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Payroll Tax"
                  />
                  <Area
                    type="monotone"
                    dataKey="corporate"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="Corporate Tax"
                  />
                  <Area type="monotone" dataKey="other" stackId="1" stroke="#6b7280" fill="#6b7280" name="Other" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources Analysis</CardTitle>
              <CardDescription>Performance and efficiency by revenue source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBySource.map((source, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{source.source}</h3>
                      <Badge variant={source.growth > 0 ? "default" : "destructive"}>
                        {source.growth > 0 ? "+" : ""}
                        {source.growth}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold">{formatCurrency(source.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Growth Rate</p>
                        <p className={`font-bold ${source.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                          {source.growth > 0 ? "+" : ""}
                          {source.growth}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Collection Efficiency</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={source.efficiency} className="flex-1" />
                          <span className="text-sm font-medium">{source.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributing States</CardTitle>
                <CardDescription>Federal revenue contribution by state</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stateContributions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => `$${value}B`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State Revenue Rankings</CardTitle>
                <CardDescription>Detailed breakdown by state contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stateContributions.map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{state.state}</p>
                          <p className="text-sm text-gray-600">{formatPercent(state.percentage)} of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(state.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Key Revenue Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2">
            <li>• Individual income tax remains the largest revenue source at 44.9% of total collections</li>
            <li>• Payroll taxes provide stable revenue growth at 5.1% annually</li>
            <li>• Corporate tax revenue has declined 1.2% due to recent policy changes</li>
            <li>• California, New York, and Texas contribute 28.1% of all federal revenue</li>
            <li>• Collection efficiency varies significantly by tax type, with payroll taxes at 99%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
