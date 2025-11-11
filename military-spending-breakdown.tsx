"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Shield, Plane, Ship, Users, Globe, AlertTriangle, TrendingUp, DollarSign, Target } from "lucide-react"

const totalDefenseSpending = 816

const militaryBranches = [
  { name: "Army", amount: 185, percentage: 22.7, color: "#10b981", icon: Users },
  { name: "Navy", amount: 165, percentage: 20.2, color: "#3b82f6", icon: Ship },
  { name: "Air Force", amount: 156, percentage: 19.1, color: "#8b5cf6", icon: Plane },
  { name: "Space Force", amount: 29, percentage: 3.6, color: "#06b6d4", icon: Globe },
  { name: "Defense-Wide", amount: 281, percentage: 34.4, color: "#f59e0b", icon: Shield },
]

const spendingCategories = [
  { category: "Personnel", amount: 162, percentage: 19.9, description: "Military pay and benefits" },
  { category: "Operations & Maintenance", amount: 289, percentage: 35.4, description: "Day-to-day operations" },
  { category: "Procurement", amount: 167, percentage: 20.5, description: "Equipment and weapons systems" },
  { category: "Research & Development", amount: 140, percentage: 17.2, description: "Military R&D programs" },
  { category: "Military Construction", amount: 11, percentage: 1.3, description: "Base construction projects" },
  { category: "Family Housing", amount: 1, percentage: 0.1, description: "Military family housing" },
  { category: "Other", amount: 46, percentage: 5.6, description: "Special operations and classified" },
]

const majorPrograms = [
  { program: "F-35 Lightning II", cost: 78, status: "Active", branch: "Multi-Service" },
  { program: "Virginia-class Submarine", cost: 22, status: "Active", branch: "Navy" },
  { program: "KC-46 Tanker", cost: 15, status: "Active", branch: "Air Force" },
  { program: "Patriot Missile System", cost: 12, status: "Active", branch: "Army" },
  { program: "Aegis Combat System", cost: 8, status: "Active", branch: "Navy" },
  { program: "B-21 Raider Bomber", cost: 25, status: "Development", branch: "Air Force" },
  { program: "Ground Based Strategic Deterrent", cost: 13, status: "Development", branch: "Air Force" },
  { program: "Columbia-class Submarine", cost: 31, status: "Development", branch: "Navy" },
]

const regionalSpending = [
  { region: "Indo-Pacific", amount: 156, percentage: 19.1, priority: "High" },
  { region: "Europe/NATO", amount: 89, percentage: 10.9, priority: "High" },
  { region: "Middle East", amount: 67, percentage: 8.2, priority: "Medium" },
  { region: "Homeland Defense", amount: 234, percentage: 28.7, priority: "Critical" },
  { region: "Global Operations", amount: 270, percentage: 33.1, priority: "High" },
]

const historicalSpending = [
  { year: 2020, amount: 714, gdpPercent: 3.4 },
  { year: 2021, amount: 740, gdpPercent: 3.2 },
  { year: 2022, amount: 766, gdpPercent: 3.0 },
  { year: 2023, amount: 792, gdpPercent: 2.9 },
  { year: 2024, amount: 805, gdpPercent: 2.8 },
  { year: 2025, amount: 816, gdpPercent: 2.8 },
]

export default function MilitarySpendingBreakdown() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

  const formatCurrency = (value: number) => `$${value.toLocaleString()}B`
  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Military Spending Breakdown</h1>
        <p className="text-lg text-gray-600">
          Comprehensive analysis of {formatCurrency(totalDefenseSpending)} in defense spending for FY 2025
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Defense</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDefenseSpending)}</p>
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
                <p className="text-2xl font-bold text-blue-600">+1.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">% of GDP</p>
                <p className="text-2xl font-bold text-purple-600">2.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Per Capita</p>
                <p className="text-2xl font-bold text-orange-600">$2,465</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branches">By Branch</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="programs">Major Programs</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Military Branches Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Military Branch</CardTitle>
                <CardDescription>Distribution across service branches</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={militaryBranches}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {militaryBranches.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Historical Spending Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Defense Spending</CardTitle>
                <CardDescription>Defense spending trend 2020-2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalSpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${value}B`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Allocation Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Military Branch Budget Allocation</CardTitle>
              <CardDescription>Visual representation of budget distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {militaryBranches.map((branch, index) => {
                  const Icon = branch.icon
                  const size = Math.max(80, (branch.percentage / 35) * 200) // Scale based on percentage

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ minHeight: "200px" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mb-3 transition-all"
                        style={{
                          backgroundColor: branch.color + "20",
                          width: `${size}px`,
                          height: `${size}px`,
                          border: `2px solid ${branch.color}`,
                        }}
                      >
                        <Icon className="h-8 w-8" style={{ color: branch.color }} />
                      </div>
                      <h3 className="font-semibold text-sm text-center mb-1">{branch.name}</h3>
                      <p className="text-lg font-bold mb-1" style={{ color: branch.color }}>
                        {formatCurrency(branch.amount)}
                      </p>
                      <Badge variant="secondary">{formatPercent(branch.percentage)}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {militaryBranches.map((branch, index) => {
              const Icon = branch.icon
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBranch === branch.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedBranch(selectedBranch === branch.name ? null : branch.name)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8" style={{ color: branch.color }} />
                      <Badge variant="outline">{formatPercent(branch.percentage)}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                    <p className="text-2xl font-bold mb-3" style={{ color: branch.color }}>
                      {formatCurrency(branch.amount)}
                    </p>
                    <Progress value={branch.percentage} className="h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedBranch && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedBranch} Detailed Breakdown</CardTitle>
                <CardDescription>Specific spending categories for {selectedBranch}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed breakdown for {selectedBranch} would be displayed here</p>
                  <p className="text-sm">Including personnel, equipment, operations, and R&D costs</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Categories</CardTitle>
              <CardDescription>Defense spending by functional category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      <Badge variant="secondary">{formatPercent(category.percentage)}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(category.amount)}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Major Defense Programs</CardTitle>
              <CardDescription>Largest defense acquisition programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {majorPrograms.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{program.program}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={program.status === "Active" ? "default" : "secondary"}>{program.status}</Badge>
                        <Badge variant="outline">{program.branch}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(program.cost)}</p>
                      <p className="text-sm text-gray-600">FY 2025 Budget</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Spending Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Defense Spending</CardTitle>
                <CardDescription>Defense spending by geographic priority</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalSpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => `$${value}B`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Priorities */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Priorities</CardTitle>
                <CardDescription>Strategic priority levels by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalSpending.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{region.region}</p>
                        <p className="text-sm text-gray-600">{formatPercent(region.percentage)} of total</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(region.amount)}</p>
                        <Badge
                          variant={
                            region.priority === "Critical"
                              ? "destructive"
                              : region.priority === "High"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {region.priority}
                        </Badge>
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
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <AlertTriangle className="h-5 w-5" />
            Defense Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Key Trends</h4>
              <ul className="space-y-1 text-sm">
                <li>• Defense-Wide programs account for 34.4% of spending</li>
                <li>• Operations & Maintenance is the largest category at 35.4%</li>
                <li>• Space Force budget has grown 15% year-over-year</li>
                <li>• R&D spending focuses on next-generation capabilities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Strategic Focus</h4>
              <ul className="space-y-1 text-sm">
                <li>• Indo-Pacific region receives highest priority funding</li>
                <li>• Modernization programs consume 37.7% of budget</li>
                <li>• Personnel costs remain stable at 19.9%</li>
                <li>• Homeland defense spending increased 8.2%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
