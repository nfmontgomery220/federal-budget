"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

// Revenue data by source (in billions)
const revenueBySource = [
  { name: "Individual Income Tax", value: 2042, percentage: 49.6, color: "#3b82f6", trend: 5.2 },
  { name: "Payroll Tax", value: 1484, percentage: 36.1, color: "#10b981", trend: 3.8 },
  { name: "Corporate Income Tax", value: 420, percentage: 10.2, color: "#f59e0b", trend: -2.1 },
  { name: "Customs Duties", value: 80, percentage: 1.9, color: "#ef4444", trend: 12.5 },
  { name: "Estate & Gift Tax", value: 33, percentage: 0.8, color: "#8b5cf6", trend: -8.3 },
  { name: "Excise Tax", value: 56, percentage: 1.4, color: "#06b6d4", trend: 1.2 },
]

// Historical revenue trends (2019-2024)
const historicalRevenue = [
  { year: 2019, individual: 1718, payroll: 1243, corporate: 230, other: 189 },
  { year: 2020, individual: 1609, payroll: 1310, corporate: 212, other: 176 },
  { year: 2021, individual: 2044, payroll: 1366, corporate: 372, other: 198 },
  { year: 2022, individual: 2048, payroll: 1484, corporate: 425, other: 203 },
  { year: 2023, individual: 2042, payroll: 1484, corporate: 420, other: 169 },
  { year: 2024, individual: 2150, payroll: 1520, corporate: 445, other: 185 },
]

// Income tax breakdown by bracket
const incomeTaxByBracket = [
  { bracket: "Top 1%", share: 42.3, avgRate: 25.9, income: "> $540K" },
  { bracket: "Top 5%", share: 62.7, avgRate: 22.4, income: "> $220K" },
  { bracket: "Top 10%", share: 73.7, avgRate: 20.3, income: "> $154K" },
  { bracket: "Top 25%", share: 89.0, avgRate: 16.8, income: "> $87K" },
  { bracket: "Top 50%", share: 97.7, avgRate: 13.6, income: "> $44K" },
  { bracket: "Bottom 50%", share: 2.3, avgRate: 3.1, income: "< $44K" },
]

// Corporate tax by industry
const corporateTaxByIndustry = [
  { industry: "Technology", amount: 89, percentage: 21.2, companies: "Apple, Microsoft, Google" },
  { industry: "Financial Services", amount: 67, percentage: 16.0, companies: "JPMorgan, Bank of America" },
  { industry: "Healthcare", amount: 45, percentage: 10.7, companies: "Johnson & Johnson, Pfizer" },
  { industry: "Energy", amount: 52, percentage: 12.4, companies: "ExxonMobil, Chevron" },
  { industry: "Manufacturing", amount: 38, percentage: 9.0, companies: "General Electric, Boeing" },
  { industry: "Retail", amount: 31, percentage: 7.4, companies: "Walmart, Amazon" },
  { industry: "Other", amount: 98, percentage: 23.3, companies: "Various sectors" },
]

// Payroll tax breakdown
const payrollTaxBreakdown = [
  { type: "Social Security (OASDI)", employee: 6.2, employer: 6.2, total: 12.4, cap: "$160,200", revenue: 1347 },
  { type: "Medicare (HI)", employee: 1.45, employer: 1.45, total: 2.9, cap: "None", revenue: 308 },
  { type: "Additional Medicare", employee: 0.9, employer: 0, total: 0.9, cap: "> $200K", revenue: 15 },
  { type: "Unemployment (FUTA)", employee: 0, employer: 0.6, total: 0.6, cap: "$7,000", revenue: 6 },
]

// State-by-state revenue contribution
const stateRevenueContribution = [
  { state: "California", amount: 476, percentage: 11.6, perCapita: 12045 },
  { state: "New York", amount: 367, percentage: 8.9, perCapita: 18876 },
  { state: "Texas", amount: 312, percentage: 7.6, perCapita: 10654 },
  { state: "Florida", amount: 198, percentage: 4.8, perCapita: 9123 },
  { state: "Illinois", amount: 156, percentage: 3.8, perCapita: 12334 },
  { state: "New Jersey", amount: 134, percentage: 3.3, perCapita: 14876 },
  { state: "Pennsylvania", amount: 128, percentage: 3.1, perCapita: 9987 },
  { state: "Ohio", amount: 98, percentage: 2.4, perCapita: 8456 },
  { state: "Georgia", amount: 89, percentage: 2.2, perCapita: 8234 },
  { state: "North Carolina", amount: 87, percentage: 2.1, perCapita: 8123 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function RevenueBreakdown() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedView, setSelectedView] = useState("overview")

  const totalRevenue = revenueBySource.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Federal Revenue Breakdown</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of federal government revenue sources</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">FY 2024</SelectItem>
              <SelectItem value="2023">FY 2023</SelectItem>
              <SelectItem value="2022">FY 2022</SelectItem>
              <SelectItem value="2021">FY 2021</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}B</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +4.2% vs prior year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Individual Income Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${revenueBySource[0].value.toLocaleString()}B</div>
            <div className="text-sm text-gray-500 mt-1">{revenueBySource[0].percentage}% of total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Corporate Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${revenueBySource[2].value.toLocaleString()}B</div>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              {revenueBySource[2].trend}% vs prior year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue per Capita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${Math.round((totalRevenue * 1000000000) / 335000000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Per US resident</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Tax</TabsTrigger>
          <TabsTrigger value="corporate">Corporate Tax</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Tax</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="states">By State</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
                <CardDescription>FY {selectedYear} federal revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}B`, "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Sources List */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources Detail</CardTitle>
                <CardDescription>Detailed breakdown with year-over-year trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBySource.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }} />
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-gray-500">
                            ${source.value}B ({source.percentage}%)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${source.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                          {source.trend > 0 ? "+" : ""}
                          {source.trend}%
                        </div>
                        <div className="text-xs text-gray-500">YoY change</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Tax by Bracket */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Share by Income Bracket</CardTitle>
                <CardDescription>Percentage of total income tax paid by bracket</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incomeTaxByBracket}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bracket" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Tax Share"]} />
                    <Bar dataKey="share" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Effective Tax Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Effective Tax Rates</CardTitle>
                <CardDescription>Average tax rate by income bracket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomeTaxByBracket.map((bracket, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{bracket.bracket}</div>
                        <div className="text-sm text-gray-500">{bracket.income}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{bracket.avgRate}%</div>
                        <div className="text-sm text-gray-500">{bracket.share}% of total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Corporate Tax by Industry */}
            <Card>
              <CardHeader>
                <CardTitle>Corporate Tax by Industry</CardTitle>
                <CardDescription>Tax contribution by major industry sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={corporateTaxByIndustry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}B`, "Tax Revenue"]} />
                    <Bar dataKey="amount" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Industry Details */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Tax Details</CardTitle>
                <CardDescription>Major contributors by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {corporateTaxByIndustry.map((industry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{industry.industry}</div>
                        <div className="text-right">
                          <div className="font-bold text-amber-600">${industry.amount}B</div>
                          <div className="text-sm text-gray-500">{industry.percentage}%</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{industry.companies}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Tax Breakdown</CardTitle>
              <CardDescription>Social Security, Medicare, and unemployment taxes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Tax Type</th>
                      <th className="text-right p-2">Employee Rate</th>
                      <th className="text-right p-2">Employer Rate</th>
                      <th className="text-right p-2">Total Rate</th>
                      <th className="text-right p-2">Wage Cap</th>
                      <th className="text-right p-2">Revenue (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollTaxBreakdown.map((tax, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{tax.type}</td>
                        <td className="text-right p-2">{tax.employee}%</td>
                        <td className="text-right p-2">{tax.employer}%</td>
                        <td className="text-right p-2 font-medium">{tax.total}%</td>
                        <td className="text-right p-2">{tax.cap}</td>
                        <td className="text-right p-2 font-bold text-green-600">${tax.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Revenue Trends</CardTitle>
              <CardDescription>Revenue by source over time (2019-2024)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}B`, "Revenue"]} />
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
                  <Area type="monotone" dataKey="other" stackId="1" stroke="#ef4444" fill="#ef4444" name="Other" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top States by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Top States by Revenue Contribution</CardTitle>
                <CardDescription>Federal tax revenue by state</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateRevenueContribution.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}B`, "Revenue"]} />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Per Capita Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Per Capita by State</CardTitle>
                <CardDescription>Federal tax revenue per resident</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stateRevenueContribution.slice(0, 10).map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="font-medium">{state.state}</div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">${state.perCapita.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">${state.amount}B total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
