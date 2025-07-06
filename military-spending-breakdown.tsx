"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Users, Plane, Ship, Truck, Zap, ChevronRight, TrendingUp, ArrowLeft, Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Military spending data (in billions)
const militarySpendingData = {
  2024: {
    total: 816,
    byBranch: [
      {
        name: "Army",
        amount: 185.9,
        percentage: 22.8,
        color: "#22c55e",
        icon: Shield,
        personnel: 485000,
        categories: {
          personnel: 89.2,
          operations: 45.8,
          procurement: 28.4,
          rdt: 15.8,
          construction: 4.2,
          family: 2.5,
        },
      },
      {
        name: "Navy",
        amount: 165.8,
        percentage: 20.3,
        color: "#3b82f6",
        icon: Ship,
        personnel: 347000,
        categories: {
          personnel: 67.4,
          operations: 42.1,
          procurement: 38.9,
          rdt: 13.2,
          construction: 3.1,
          family: 1.1,
        },
      },
      {
        name: "Air Force",
        amount: 194.0,
        percentage: 23.8,
        color: "#06b6d4",
        icon: Plane,
        personnel: 329000,
        categories: {
          personnel: 71.8,
          operations: 48.3,
          procurement: 52.1,
          rdt: 17.4,
          construction: 3.2,
          family: 1.2,
        },
      },
      {
        name: "Marines",
        amount: 51.4,
        percentage: 6.3,
        color: "#ef4444",
        icon: Users,
        personnel: 186000,
        categories: {
          personnel: 28.9,
          operations: 12.8,
          procurement: 6.2,
          rdt: 2.1,
          construction: 1.1,
          family: 0.3,
        },
      },
      {
        name: "Space Force",
        amount: 29.4,
        percentage: 3.6,
        color: "#8b5cf6",
        icon: Zap,
        personnel: 8600,
        categories: {
          personnel: 2.8,
          operations: 8.9,
          procurement: 15.2,
          rdt: 2.1,
          construction: 0.3,
          family: 0.1,
        },
      },
      {
        name: "Defense-Wide",
        amount: 189.5,
        percentage: 23.2,
        color: "#f59e0b",
        icon: Shield,
        personnel: 95000,
        categories: {
          personnel: 45.2,
          operations: 89.4,
          procurement: 32.8,
          rdt: 18.9,
          construction: 2.1,
          family: 1.1,
        },
      },
    ],
    procurement: {
      aircraft: {
        total: 78.4,
        items: [
          { name: "F-35 Lightning II", amount: 15.2, quantity: 83, branch: "Multi-Service" },
          { name: "KC-46 Tanker", amount: 2.8, quantity: 15, branch: "Air Force" },
          { name: "CH-53K Helicopter", amount: 1.9, quantity: 9, branch: "Marines" },
          { name: "V-22 Osprey", amount: 1.4, quantity: 14, branch: "Multi-Service" },
          { name: "Apache Helicopter", amount: 1.2, quantity: 24, branch: "Army" },
        ],
      },
      ships: {
        total: 32.1,
        items: [
          { name: "Virginia-class Submarine", amount: 7.2, quantity: 2, branch: "Navy" },
          { name: "Arleigh Burke Destroyer", amount: 5.8, quantity: 2, branch: "Navy" },
          { name: "Ford-class Carrier", amount: 4.1, quantity: 1, branch: "Navy" },
          { name: "Littoral Combat Ship", amount: 1.8, quantity: 2, branch: "Navy" },
          { name: "Expeditionary Fast Transport", amount: 0.4, quantity: 2, branch: "Navy" },
        ],
      },
      vehicles: {
        total: 18.7,
        items: [
          { name: "Joint Light Tactical Vehicle", amount: 3.2, quantity: 5420, branch: "Multi-Service" },
          { name: "Armored Multi-Purpose Vehicle", amount: 1.8, quantity: 164, branch: "Army" },
          { name: "Bradley Fighting Vehicle Upgrade", amount: 1.4, quantity: 89, branch: "Army" },
          { name: "Stryker Vehicle", amount: 0.9, quantity: 91, branch: "Army" },
          { name: "Mine Resistant Vehicle", amount: 0.6, quantity: 234, branch: "Multi-Service" },
        ],
      },
      weapons: {
        total: 24.3,
        items: [
          { name: "Patriot Missile System", amount: 4.2, quantity: 168, branch: "Army" },
          { name: "HIMARS Rocket System", amount: 2.8, quantity: 36, branch: "Army" },
          { name: "Tomahawk Missiles", amount: 2.1, quantity: 200, branch: "Navy" },
          { name: "JASSM Missiles", amount: 1.9, quantity: 414, branch: "Air Force" },
          { name: "Standard Missiles", amount: 1.6, quantity: 125, branch: "Navy" },
        ],
      },
      other: {
        total: 19.8,
        items: [
          { name: "Cybersecurity Systems", amount: 8.9, quantity: 1, branch: "Defense-Wide" },
          { name: "Satellite Systems", amount: 4.2, quantity: 12, branch: "Space Force" },
          { name: "Communications Equipment", amount: 3.1, quantity: 1, branch: "Multi-Service" },
          { name: "Intelligence Systems", amount: 2.4, quantity: 1, branch: "Defense-Wide" },
          { name: "Medical Equipment", amount: 1.2, quantity: 1, branch: "Multi-Service" },
        ],
      },
    },
  },
}

const personnelCosts = {
  categories: [
    { name: "Basic Pay", amount: 89.4, percentage: 29.8 },
    { name: "Allowances (Housing/Food)", amount: 67.2, percentage: 22.4 },
    { name: "Healthcare", amount: 55.8, percentage: 18.6 },
    { name: "Retirement", amount: 42.1, percentage: 14.0 },
    { name: "Special Pay & Bonuses", amount: 28.9, percentage: 9.6 },
    { name: "Training & Education", amount: 16.6, percentage: 5.5 },
  ],
}

const historicalTrends = [
  { year: 2020, total: 714, personnel: 289, operations: 278, procurement: 147 },
  { year: 2021, total: 740, personnel: 295, operations: 285, procurement: 160 },
  { year: 2022, total: 766, personnel: 301, operations: 292, procurement: 173 },
  { year: 2023, total: 792, personnel: 307, operations: 298, procurement: 187 },
  { year: 2024, total: 816, personnel: 312, operations: 304, procurement: 200 },
]

interface MilitarySpendingBreakdownProps {
  onBack?: () => void
}

export default function MilitarySpendingBreakdown({ onBack }: MilitarySpendingBreakdownProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const currentData = militarySpendingData[selectedYear as keyof typeof militarySpendingData]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount * 1000000000)
  }

  const formatBillions = (amount: number) => {
    return `$${amount.toLocaleString()}B`
  }

  const formatPersonnel = (count: number) => {
    return count.toLocaleString()
  }

  const getBranchData = (branchName: string) => {
    return currentData.byBranch.find((branch) => branch.name === branchName)
  }

  const resetDrillDown = () => {
    setSelectedBranch(null)
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {(selectedBranch || selectedCategory) && (
                <Button variant="ghost" size="sm" onClick={resetDrillDown}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Overview
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedBranch
                  ? `${selectedBranch} Spending Analysis`
                  : selectedCategory
                    ? `${selectedCategory} Analysis`
                    : "Military Spending Breakdown"}
              </h1>
            </div>
            <p className="text-gray-600">
              {selectedBranch
                ? `Detailed analysis of ${selectedBranch} budget allocation`
                : selectedCategory
                  ? `Comprehensive breakdown of ${selectedCategory} spending`
                  : "Comprehensive analysis of defense spending by branch, personnel, and equipment"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">FY 2024</SelectItem>
                <SelectItem value="2023">FY 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Defense Budget</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatBillions(currentData.total)}</div>
              <p className="text-xs text-muted-foreground">+3.0% from previous year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Personnel</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPersonnel(currentData.byBranch.reduce((sum, branch) => sum + branch.personnel, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Total active duty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personnel Costs</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">$312B</div>
              <p className="text-xs text-muted-foreground">38.2% of total budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procurement</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">$200B</div>
              <p className="text-xs text-muted-foreground">24.5% of total budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">By Branch</TabsTrigger>
            <TabsTrigger value="personnel">Personnel</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {!selectedBranch ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branch Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Military Branch</CardTitle>
                    <CardDescription>Budget allocation across service branches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{data.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {formatBillions(data.amount)} ({data.percentage}%)
                                    </p>
                                    <p className="text-xs text-gray-500">{formatPersonnel(data.personnel)} personnel</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <PieChart data={currentData.byBranch}>
                            {currentData.byBranch.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </PieChart>
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Branch Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Details</CardTitle>
                    <CardDescription>Click on any branch for detailed breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentData.byBranch.map((branch, index) => {
                        const IconComponent = branch.icon
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => setSelectedBranch(branch.name)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `${branch.color}20` }}>
                                <IconComponent className="h-5 w-5" style={{ color: branch.color }} />
                              </div>
                              <div>
                                <div className="font-medium">{branch.name}</div>
                                <div className="text-sm text-gray-600">
                                  {formatPersonnel(branch.personnel)} personnel
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="font-bold">{formatBillions(branch.amount)}</div>
                                <div className="text-sm text-gray-600">{branch.percentage}%</div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Branch Detail View
              <div className="space-y-6">
                {(() => {
                  const branchData = getBranchData(selectedBranch)
                  if (!branchData) return null

                  const categoryData = [
                    { name: "Personnel", amount: branchData.categories.personnel, color: "#3b82f6" },
                    { name: "Operations", amount: branchData.categories.operations, color: "#10b981" },
                    { name: "Procurement", amount: branchData.categories.procurement, color: "#f59e0b" },
                    { name: "R&D", amount: branchData.categories.rdt, color: "#ef4444" },
                    { name: "Construction", amount: branchData.categories.construction, color: "#8b5cf6" },
                    { name: "Family Programs", amount: branchData.categories.family, color: "#06b6d4" },
                  ]

                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-lg" style={{ backgroundColor: `${branchData.color}20` }}>
                                <branchData.icon className="h-6 w-6" style={{ color: branchData.color }} />
                              </div>
                              <div>
                                <div className="text-2xl font-bold">{formatBillions(branchData.amount)}</div>
                                <div className="text-sm text-gray-600">Total Budget</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Users className="h-6 w-6 text-green-600" />
                              <div>
                                <div className="text-2xl font-bold">{formatPersonnel(branchData.personnel)}</div>
                                <div className="text-sm text-gray-600">Active Personnel</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-6 w-6 text-blue-600" />
                              <div>
                                <div className="text-2xl font-bold">{branchData.percentage}%</div>
                                <div className="text-sm text-gray-600">of Total Defense</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>{selectedBranch} Budget Categories</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {categoryData.map((category, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{category.name}</span>
                                    <span className="font-bold">{formatBillions(category.amount)}</span>
                                  </div>
                                  <Progress value={(category.amount / branchData.amount) * 100} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Category Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer
                              config={{
                                amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                              }}
                              className="h-[300px]"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                  <YAxis />
                                  <ChartTooltip
                                    content={({ active, payload, label }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                                            <p className="font-medium">{label}</p>
                                            <p className="text-sm text-gray-600">
                                              {formatBillions(payload[0].value as number)}
                                            </p>
                                          </div>
                                        )
                                      }
                                      return null
                                    }}
                                  />
                                  <Bar dataKey="amount" fill="#3b82f6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personnel" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personnel Costs Breakdown</CardTitle>
                  <CardDescription>Total personnel costs: $312B (38.2% of defense budget)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personnelCosts.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <div className="text-right">
                            <div className="font-bold">{formatBillions(category.amount)}</div>
                            <div className="text-sm text-gray-600">{category.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personnel by Branch</CardTitle>
                  <CardDescription>Active duty personnel distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      personnel: { label: "Personnel", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentData.byBranch}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm text-gray-600">
                                    {formatPersonnel(payload[0].value as number)} personnel
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="personnel" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(currentData.procurement).map(([category, data]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {category === "aircraft" && <Plane className="h-5 w-5" />}
                      {category === "ships" && <Ship className="h-5 w-5" />}
                      {category === "vehicles" && <Truck className="h-5 w-5" />}
                      {category === "weapons" && <Zap className="h-5 w-5" />}
                      {category === "other" && <Shield className="h-5 w-5" />}
                      {category} Procurement
                    </CardTitle>
                    <CardDescription>Total: {formatBillions(data.total)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-600">
                              {item.quantity} units • {item.branch}
                            </div>
                          </div>
                          <div className="font-bold text-sm">{formatBillions(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Defense Spending Trends</CardTitle>
                <CardDescription>5-year historical view of defense budget categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    total: { label: "Total", color: "hsl(var(--chart-1))" },
                    personnel: { label: "Personnel", color: "hsl(var(--chart-2))" },
                    operations: { label: "Operations", color: "hsl(var(--chart-3))" },
                    procurement: { label: "Procurement", color: "hsl(var(--chart-4))" },
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
                                <p className="font-medium">FY {label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {formatBillions(entry.value as number)}
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={3} />
                      <Line type="monotone" dataKey="personnel" stroke="var(--color-personnel)" strokeWidth={2} />
                      <Line type="monotone" dataKey="operations" stroke="var(--color-operations)" strokeWidth={2} />
                      <Line type="monotone" dataKey="procurement" stroke="var(--color-procurement)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
