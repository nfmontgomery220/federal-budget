"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  LineChart,
  Line,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Building2,
  Shield,
  Heart,
  Calculator,
  BarChart3,
  PieChartIcon,
  Target,
  FileText,
  Info,
} from "lucide-react"

const budgetData = {
  totalSpending: 7200,
  totalRevenue: 4550,
  deficit: 2650,
  debtToGDP: 106.2,
}

const spendingCategories = [
  { name: "Social Security", amount: 1347, percentage: 18.7, color: "#3b82f6", icon: Users },
  { name: "Medicare", amount: 1019, percentage: 14.2, color: "#ef4444", icon: Heart },
  { name: "Defense", amount: 816, percentage: 11.3, color: "#10b981", icon: Shield },
  { name: "Interest on Debt", amount: 640, percentage: 8.9, color: "#f59e0b", icon: TrendingUp },
  { name: "Medicaid", amount: 616, percentage: 8.6, color: "#8b5cf6", icon: Heart },
  { name: "Veterans Benefits", amount: 303, percentage: 4.2, color: "#06b6d4", icon: Shield },
  { name: "Education", amount: 80, percentage: 1.1, color: "#84cc16", icon: Building2 },
  { name: "Other", amount: 2379, percentage: 33.0, color: "#6b7280", icon: Calculator },
]

const revenueCategories = [
  { name: "Individual Income Tax", amount: 2044, percentage: 44.9, color: "#3b82f6" },
  { name: "Payroll Tax", amount: 1614, percentage: 35.5, color: "#10b981" },
  { name: "Corporate Income Tax", amount: 420, percentage: 9.2, color: "#f59e0b" },
  { name: "Other", amount: 472, percentage: 10.4, color: "#6b7280" },
]

const historicalDeficit = [
  { year: 2020, deficit: 3132, gdp: 21060 },
  { year: 2021, deficit: 2772, gdp: 22996 },
  { year: 2022, deficit: 1375, gdp: 25462 },
  { year: 2023, deficit: 1695, gdp: 26854 },
  { year: 2024, deficit: 1833, gdp: 28269 },
  { year: 2025, deficit: 2650, gdp: 29500 },
]

const keyMetrics = [
  {
    title: "Deficit Crisis",
    value: "$2.65T",
    change: "+44.6%",
    trend: "up",
    description: "Annual budget deficit",
    color: "red",
    icon: TrendingDown,
  },
  {
    title: "Debt-to-GDP",
    value: "106.2%",
    change: "+3.8%",
    trend: "up",
    description: "National debt ratio",
    color: "orange",
    icon: AlertTriangle,
  },
  {
    title: "Interest Payments",
    value: "$640B",
    change: "+23.1%",
    trend: "up",
    description: "Annual debt service",
    color: "red",
    icon: TrendingUp,
  },
  {
    title: "Revenue Growth",
    value: "+2.8%",
    change: "vs 2024",
    trend: "up",
    description: "Federal revenue increase",
    color: "green",
    icon: DollarSign,
  },
]

export default function FederalBudgetDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Federal Budget Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Real-time analysis of the 2025 federal budget crisis following the "One Big Beautiful Bill Act"
        </p>
      </div>

      {/* Crisis Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>🚨 Historic Fiscal Crisis</strong> - The July 4th, 2025 "One Big Beautiful Bill Act" has created the
          largest peacetime deficit in U.S. history at $2.65 trillion annually.
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon
          const colorClasses = {
            red: "text-red-600 bg-red-50 border-red-200",
            orange: "text-orange-600 bg-orange-50 border-orange-200",
            green: "text-green-600 bg-green-50 border-green-200",
          }

          return (
            <Card key={index} className={`${colorClasses[metric.color as keyof typeof colorClasses]} border`}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Icon
                    className={`h-8 w-8 ${metric.color === "red" ? "text-red-600" : metric.color === "orange" ? "text-orange-600" : "text-green-600"}`}
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p
                      className={`text-2xl font-bold ${metric.color === "red" ? "text-red-600" : metric.color === "orange" ? "text-orange-600" : "text-green-600"}`}
                    >
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-500">
                      {metric.change} {metric.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Federal Spending Breakdown</CardTitle>
            <CardDescription>{formatCurrency(budgetData.totalSpending)} total spending for FY 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {spendingCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Federal Revenue Sources</CardTitle>
            <CardDescription>{formatCurrency(budgetData.totalRevenue)} total revenue for FY 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historical Deficit Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Deficit Trend</CardTitle>
          <CardDescription>Annual budget deficit from 2020-2025</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalDeficit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line
                type="monotone"
                dataKey="deficit"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending Categories Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Categories Detail</CardTitle>
          <CardDescription>Click on a category to explore detailed breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spendingCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.name ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5" style={{ color: category.color }} />
                    <Badge variant="secondary">{formatPercent(category.percentage)}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-2xl font-bold mb-2" style={{ color: category.color }}>
                    {formatCurrency(category.amount)}
                  </p>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tools Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Tools</CardTitle>
          <CardDescription>Quick access to budget analysis and policy tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <Calculator className="h-5 w-5" />
              <span className="text-xs">Budget Builder</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <Target className="h-5 w-5" />
              <span className="text-xs">Tax Design</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <Shield className="h-5 w-5" />
              <span className="text-xs">Defense Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <PieChartIcon className="h-5 w-5" />
              <span className="text-xs">Revenue</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent">
              <FileText className="h-5 w-5" />
              <span className="text-xs">Proposals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Key Budget Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Critical Issues</h4>
              <ul className="space-y-1 text-sm">
                <li>• Deficit increased 44.6% to historic $2.65T</li>
                <li>• Interest payments now consume 8.9% of budget</li>
                <li>• Debt-to-GDP ratio exceeds 106%</li>
                <li>• Mandatory spending dominates at 67% of budget</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Immediate Actions Needed</h4>
              <ul className="space-y-1 text-sm">
                <li>• Revenue increases of $1.3T+ required</li>
                <li>• Spending cuts of $1.3T+ needed</li>
                <li>• Entitlement reform discussions urgent</li>
                <li>• Tax policy overhaul necessary</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
