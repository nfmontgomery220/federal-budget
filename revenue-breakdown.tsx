"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Home,
  Car,
  ShoppingCart,
  AlertTriangle,
  Info,
} from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

// 2025 Federal Revenue Data (in billions)
const revenueData = {
  individual: 2044,
  payroll: 1614,
  corporate: 420,
  customs: 95,
  estate: 28,
  excise: 65,
  other: 134,
}

const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + val, 0)

const revenueBreakdown = [
  {
    name: "Individual Income Tax",
    value: revenueData.individual,
    percentage: ((revenueData.individual / totalRevenue) * 100).toFixed(1),
    icon: Users,
    description: "Personal income taxes from wages, salaries, and investments",
    color: "#0088FE",
  },
  {
    name: "Payroll Taxes",
    value: revenueData.payroll,
    percentage: ((revenueData.payroll / totalRevenue) * 100).toFixed(1),
    icon: Briefcase,
    description: "Social Security and Medicare taxes",
    color: "#00C49F",
  },
  {
    name: "Corporate Income Tax",
    value: revenueData.corporate,
    percentage: ((revenueData.corporate / totalRevenue) * 100).toFixed(1),
    icon: Building2,
    description: "Taxes on business profits",
    color: "#FFBB28",
  },
  {
    name: "Customs Duties",
    value: revenueData.customs,
    percentage: ((revenueData.customs / totalRevenue) * 100).toFixed(1),
    icon: ShoppingCart,
    description: "Tariffs on imported goods",
    color: "#FF8042",
  },
  {
    name: "Estate & Gift Tax",
    value: revenueData.estate,
    percentage: ((revenueData.estate / totalRevenue) * 100).toFixed(1),
    icon: Home,
    description: "Taxes on large inheritances and gifts",
    color: "#8884D8",
  },
  {
    name: "Excise Taxes",
    value: revenueData.excise,
    percentage: ((revenueData.excise / totalRevenue) * 100).toFixed(1),
    icon: Car,
    description: "Taxes on fuel, alcohol, tobacco, and other goods",
    color: "#82CA9D",
  },
  {
    name: "Other Revenue",
    value: revenueData.other,
    percentage: ((revenueData.other / totalRevenue) * 100).toFixed(1),
    icon: DollarSign,
    description: "Fees, fines, and miscellaneous revenue",
    color: "#FFC658",
  },
]

const historicalData = [
  { year: 2020, individual: 1609, payroll: 1310, corporate: 212, total: 3421 },
  { year: 2021, individual: 2044, payroll: 1366, corporate: 372, total: 4047 },
  { year: 2022, individual: 2044, payroll: 1485, corporate: 425, total: 4896 },
  { year: 2023, individual: 2042, payroll: 1614, corporate: 420, total: 4439 },
  { year: 2024, individual: 2132, payroll: 1635, corporate: 435, total: 4600 },
  { year: 2025, individual: 2044, payroll: 1614, corporate: 420, total: 4400 },
]

const incomeBrackets = [
  { bracket: "Bottom 50%", share: 11.6, avgRate: 3.1, income: "<$46,637" },
  { bracket: "Top 50%", share: 88.4, avgRate: 15.9, income: "$46,637+" },
  { bracket: "Top 25%", share: 68.9, avgRate: 19.7, income: "$94,440+" },
  { bracket: "Top 10%", share: 51.4, avgRate: 23.5, income: "$169,800+" },
  { bracket: "Top 5%", share: 37.9, avgRate: 26.8, income: "$252,840+" },
  { bracket: "Top 1%", share: 22.2, avgRate: 29.1, income: "$682,577+" },
]

export default function RevenueBreakdown() {
  const [selectedView, setSelectedView] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const formatBillions = (value: number) => `$${value.toFixed(0)}B`
  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const pieData = revenueBreakdown.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Federal Revenue Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive breakdown of U.S. government revenue sources for fiscal year 2025
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total: {formatBillions(totalRevenue)}
        </Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Revenue projections based on CBO estimates and current tax policy. Actual collections may vary based on
          economic conditions.
        </AlertDescription>
      </Alert>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="brackets">Income Brackets</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
                <CardDescription>Distribution of federal revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatBillions(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Comparison</CardTitle>
                <CardDescription>Major revenue sources comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueBreakdown.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis tickFormatter={formatBillions} />
                    <Tooltip formatter={(value: number) => formatBillions(value)} />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revenueBreakdown.map((item, index) => {
              const Icon = item.icon
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === item.name ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">{formatBillions(item.value)}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Progress value={Number.parseFloat(item.percentage)} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Revenue Trends</CardTitle>
              <CardDescription>Federal revenue by source over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatBillions} />
                  <Tooltip formatter={(value: number) => formatBillions(value)} />
                  <Area
                    type="monotone"
                    dataKey="individual"
                    stackId="1"
                    stroke="#0088FE"
                    fill="#0088FE"
                    name="Individual Income Tax"
                  />
                  <Area
                    type="monotone"
                    dataKey="payroll"
                    stackId="1"
                    stroke="#00C49F"
                    fill="#00C49F"
                    name="Payroll Taxes"
                  />
                  <Area
                    type="monotone"
                    dataKey="corporate"
                    stackId="1"
                    stroke="#FFBB28"
                    fill="#FFBB28"
                    name="Corporate Income Tax"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">+28.6%</p>
                    <p className="text-sm text-muted-foreground">5-Year Growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatBillions(4400)}</p>
                    <p className="text-sm text-muted-foreground">2025 Projected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">18.1%</p>
                    <p className="text-sm text-muted-foreground">% of GDP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brackets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Tax Distribution</CardTitle>
              <CardDescription>Share of income taxes paid by income bracket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeBrackets.map((bracket, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{bracket.bracket}</span>
                        <Badge variant="outline">{bracket.income}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tax Share: </span>
                          <span className="font-semibold">{bracket.share}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Rate: </span>
                          <span className="font-semibold">{bracket.avgRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Progress value={bracket.share} className="w-24 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Concentration</CardTitle>
                <CardDescription>Analysis of revenue source dependency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Dependency:</strong> Individual income taxes account for 46.4% of total revenue,
                    creating vulnerability to economic downturns.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Top 2 Sources</span>
                    <span className="font-semibold">83.1% of revenue</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top 3 Sources</span>
                    <span className="font-semibold">92.7% of revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Economic Sensitivity</CardTitle>
                <CardDescription>Revenue volatility by source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Corporate Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm font-semibold">High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Individual Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20 h-2" />
                      <span className="text-sm font-semibold">Medium</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payroll Tax</span>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <span className="text-sm font-semibold">Low</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Policy Implications</CardTitle>
              <CardDescription>Key insights for fiscal policy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Progressive income tax system</li>
                    <li>• Stable payroll tax base</li>
                    <li>• Diversified revenue sources</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 text-orange-600">Challenges</h4>
                  <ul className="text-sm space-y-1">
                    <li>• High dependency on top earners</li>
                    <li>• Corporate tax volatility</li>
                    <li>• Limited growth in some sources</li>
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
