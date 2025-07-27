"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, DollarSign, Users, Building2, Ship, Wine, Home, Download, PieChart } from "lucide-react"
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const revenueData = {
  2024: {
    total: 4900,
    categories: [
      {
        name: "Individual Income Taxes",
        amount: 2042,
        percentage: 41.7,
        color: "#3b82f6",
        icon: Users,
      },
      {
        name: "Payroll Taxes",
        amount: 1614,
        percentage: 32.9,
        color: "#10b981",
        icon: Building2,
      },
      {
        name: "Corporate Income Taxes",
        amount: 420,
        percentage: 8.6,
        color: "#f59e0b",
        icon: Building2,
      },
      {
        name: "Customs Duties",
        amount: 98,
        percentage: 2,
        color: "#ef4444",
        icon: Ship,
      },
      {
        name: "Excise Taxes",
        amount: 67,
        percentage: 1.4,
        color: "#8b5cf6",
        icon: Wine,
      },
      {
        name: "Estate & Gift Taxes",
        amount: 34,
        percentage: 0.7,
        color: "#06b6d4",
        icon: Home,
      },
      {
        name: "Other",
        amount: 625,
        percentage: 12.8,
        color: "#6b7280",
        icon: DollarSign,
      },
    ],
  },
} as const

const historical = [
  { year: 2020, total: 3421 },
  { year: 2021, total: 4047 },
  { year: 2022, total: 4896 },
  { year: 2023, total: 4439 },
  { year: 2024, total: 4900 },
]

type YearKey = keyof typeof revenueData

export interface RevenueBreakdownProps {
  onBack?: () => void
}

const fmtBillions = (n: number) => `$${n.toLocaleString()}B`

export default function RevenueBreakdown({ onBack }: RevenueBreakdownProps) {
  const [year, setYear] = useState<YearKey>("2024")
  const [activeTab, setActiveTab] = useState("overview")

  const data = revenueData[year]

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Overview
              </Button>
            )}
            <h1 className="text-3xl font-bold">Federal Revenue Analysis</h1>
          </div>
          <p className="text-gray-600">Fiscal Year {year}</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={year} onValueChange={(v) => setYear(v as YearKey)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(revenueData).map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 space-y-4 max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>Share by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ amount: { label: "Amount", color: "hsl(var(--chart-1))" } }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <ChartTooltip
                        content={({ active, payload }) =>
                          active && payload?.[0] ? (
                            <div className="bg-white border p-2 rounded shadow">
                              <p className="font-medium">{payload[0].payload.name}</p>
                              <p className="text-sm">{fmtBillions(payload[0].payload.amount)}</p>
                            </div>
                          ) : null
                        }
                      />
                      <Pie data={data.categories} dataKey="amount" nameKey="name" innerRadius={60} outerRadius={100}>
                        {data.categories.map((c, i) => (
                          <Cell key={i} fill={c.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
                <CardDescription>Hover the chart or read the list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.categories.map((c) => {
                  const Icon = c.icon
                  return (
                    <div key={c.name} className="flex justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" style={{ color: c.color }} />
                        <span>{c.name}</span>
                      </div>
                      <span className="font-medium">{fmtBillions(c.amount)}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detail Table</CardTitle>
              <CardDescription>Total revenue: {fmtBillions(data.total)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.categories.map((c) => (
                <div key={c.name} className="flex justify-between items-center">
                  <span>{c.name}</span>
                  <Progress value={c.percentage} className="w-3/5 h-2 mx-4" />
                  <span className="tabular-nums">{c.percentage}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Trend</CardTitle>
              <CardDescription>5-year total revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ total: { label: "Total", color: "hsl(var(--chart-1))" } }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="bg-white border p-2 rounded shadow">
                            FY {payload[0].payload.year}: {fmtBillions(payload[0].payload.total)}
                          </div>
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="var(--color-total)"
                      fill="var(--color-total)"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
