"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AreaChart,
  Area,
} from "recharts"
import { Shield, Plane, Ship, Users, Wrench, Globe, TrendingDown, TrendingUp, AlertTriangle, Info } from "lucide-react"

interface MilitaryBranch {
  id: string
  name: string
  budget: number
  personnel: number
  description: string
  icon: any
  color: string
  subcategories: MilitarySubcategory[]
}

interface MilitarySubcategory {
  id: string
  name: string
  budget: number
  description: string
  percentage: number
}

const militaryBranches: MilitaryBranch[] = [
  {
    id: "army",
    name: "Army",
    budget: 173,
    personnel: 485000,
    description: "Ground forces and land-based operations",
    icon: Users,
    color: "#22c55e",
    subcategories: [
      { id: "personnel", name: "Personnel", budget: 69, description: "Salaries and benefits", percentage: 40 },
      { id: "operations", name: "Operations", budget: 52, description: "Training and maintenance", percentage: 30 },
      { id: "procurement", name: "Procurement", budget: 35, description: "Equipment and weapons", percentage: 20 },
      { id: "rdt", name: "R&D", budget: 17, description: "Research and development", percentage: 10 },
    ],
  },
  {
    id: "navy",
    name: "Navy",
    budget: 165,
    personnel: 347000,
    description: "Naval operations and Marine Corps",
    icon: Ship,
    color: "#3b82f6",
    subcategories: [
      { id: "personnel", name: "Personnel", budget: 66, description: "Salaries and benefits", percentage: 40 },
      { id: "operations", name: "Operations", budget: 50, description: "Ship operations and training", percentage: 30 },
      { id: "procurement", name: "Procurement", budget: 33, description: "Ships and aircraft", percentage: 20 },
      { id: "rdt", name: "R&D", budget: 16, description: "Naval technology", percentage: 10 },
    ],
  },
  {
    id: "air_force",
    name: "Air Force",
    budget: 156,
    personnel: 329000,
    description: "Air and space operations",
    icon: Plane,
    color: "#8b5cf6",
    subcategories: [
      { id: "personnel", name: "Personnel", budget: 62, description: "Salaries and benefits", percentage: 40 },
      {
        id: "operations",
        name: "Operations",
        budget: 47,
        description: "Flight operations and training",
        percentage: 30,
      },
      { id: "procurement", name: "Procurement", budget: 31, description: "Aircraft and missiles", percentage: 20 },
      { id: "rdt", name: "R&D", budget: 16, description: "Aerospace technology", percentage: 10 },
    ],
  },
  {
    id: "space_force",
    name: "Space Force",
    budget: 24,
    personnel: 16000,
    description: "Space operations and satellite defense",
    icon: Globe,
    color: "#f59e0b",
    subcategories: [
      { id: "personnel", name: "Personnel", budget: 10, description: "Salaries and benefits", percentage: 42 },
      { id: "operations", name: "Operations", budget: 7, description: "Satellite operations", percentage: 29 },
      { id: "procurement", name: "Procurement", budget: 5, description: "Space systems", percentage: 21 },
      { id: "rdt", name: "R&D", budget: 2, description: "Space technology", percentage: 8 },
    ],
  },
  {
    id: "defense_wide",
    name: "Defense-Wide",
    budget: 298,
    personnel: 0,
    description: "Special operations, intelligence, and joint activities",
    icon: Shield,
    color: "#ef4444",
    subcategories: [
      { id: "special_ops", name: "Special Operations", budget: 119, description: "SOCOM operations", percentage: 40 },
      { id: "intelligence", name: "Intelligence", budget: 89, description: "Defense intelligence", percentage: 30 },
      {
        id: "joint_ops",
        name: "Joint Operations",
        budget: 60,
        description: "Multi-service operations",
        percentage: 20,
      },
      { id: "other", name: "Other", budget: 30, description: "Miscellaneous defense activities", percentage: 10 },
    ],
  },
]

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

export default function MilitarySpendingBreakdown() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const totalBudget = militaryBranches.reduce((sum, branch) => sum + branch.budget, 0)
  const totalPersonnel = militaryBranches.reduce((sum, branch) => sum + branch.personnel, 0)

  const branchData = militaryBranches.map((branch, index) => ({
    ...branch,
    percentage: ((branch.budget / totalBudget) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }))

  const personnelData = militaryBranches
    .filter((branch) => branch.personnel > 0)
    .map((branch, index) => ({
      name: branch.name,
      personnel: branch.personnel,
      budget: branch.budget,
      costPerPerson: Math.round((branch.budget * 1000000000) / branch.personnel),
      color: COLORS[index % COLORS.length],
    }))

  const categoryBreakdown = [
    { name: "Personnel", value: 267, percentage: 32.7 },
    { name: "Operations & Maintenance", value: 289, percentage: 35.4 },
    { name: "Procurement", value: 147, percentage: 18.0 },
    { name: "R&D", value: 113, percentage: 13.9 },
  ]

  const efficiencyMetrics = [
    { metric: "Cost per Active Personnel", value: "$356K", trend: "up", change: "+3.2%" },
    { metric: "Readiness Rate", value: "78%", trend: "down", change: "-2.1%" },
    { metric: "Equipment Modernization", value: "65%", trend: "up", change: "+5.4%" },
    { metric: "Training Hours per Person", value: "847", trend: "down", change: "-1.8%" },
  ]

  const historicalData = [
    { year: "2020", budget: 714, personnel: 1340 },
    { year: "2021", budget: 740, personnel: 1355 },
    { year: "2022", budget: 766, personnel: 1368 },
    { year: "2023", budget: 792, personnel: 1375 },
    { year: "2024", budget: 805, personnel: 1382 },
    { year: "2025", budget: 816, personnel: 1390 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Military Spending Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive breakdown of defense spending across military branches, personnel, equipment, and operations.
          Analyze efficiency metrics and identify optimization opportunities.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${totalBudget}B</p>
                <p className="text-sm text-muted-foreground">Total Defense Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{(totalPersonnel / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Active Personnel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Wrench className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${((totalBudget * 1000000000) / totalPersonnel / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground">Cost per Person</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Globe className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">11.3%</p>
                <p className="text-sm text-muted-foreground">of Federal Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branches">By Branch</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution by Branch</CardTitle>
                <CardDescription>How defense spending is allocated across military branches</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={branchData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                    >
                      {branchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}B`, "Budget"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget vs Personnel</CardTitle>
                <CardDescription>Relationship between spending and personnel by branch</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={personnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="budget" fill="#8884d8" name="Budget ($B)" />
                    <Bar yAxisId="right" dataKey="personnel" fill="#82ca9d" name="Personnel (K)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Allocation Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Defense Budget Allocation</CardTitle>
              <CardDescription>Visual representation of budget distribution across branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {militaryBranches.map((branch) => {
                  const Icon = branch.icon
                  const size = Math.max(100, (branch.budget / totalBudget) * 400)
                  return (
                    <div
                      key={branch.id}
                      className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ minHeight: `${size}px` }}
                    >
                      <div
                        className="w-full h-full flex flex-col items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: branch.color, minHeight: `${size * 0.7}px` }}
                      >
                        <Icon className="h-8 w-8 mb-2" />
                        <div className="text-center">
                          <div className="font-bold text-lg">{branch.name}</div>
                          <div className="text-sm">${branch.budget}B</div>
                          <div className="text-xs opacity-90">{((branch.budget / totalBudget) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid gap-6">
            {militaryBranches.map((branch) => {
              const Icon = branch.icon
              return (
                <Card key={branch.id} className={selectedBranch === branch.id ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" style={{ color: branch.color }} />
                        <span>{branch.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">${branch.budget}B</Badge>
                        <Badge variant="secondary">{((branch.budget / totalBudget) * 100).toFixed(1)}%</Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>{branch.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Budget Breakdown</h4>
                        <div className="space-y-3">
                          {branch.subcategories.map((sub) => (
                            <div key={sub.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{sub.name}</span>
                                <span>
                                  ${sub.budget}B ({sub.percentage}%)
                                </span>
                              </div>
                              <Progress value={sub.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Key Metrics</h4>
                        <div className="space-y-2">
                          {branch.personnel > 0 && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Personnel</span>
                              <span className="font-medium">{branch.personnel.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Budget Share</span>
                            <span className="font-medium">{((branch.budget / totalBudget) * 100).toFixed(1)}%</span>
                          </div>
                          {branch.personnel > 0 && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Cost per Person</span>
                              <span className="font-medium">
                                ${Math.round((branch.budget * 1000000000) / branch.personnel / 1000)}K
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant={selectedBranch === branch.id ? "default" : "outline"}
                        onClick={() => setSelectedBranch(selectedBranch === branch.id ? null : branch.id)}
                        className="w-full"
                      >
                        {selectedBranch === branch.id ? "Hide Details" : "View Detailed Analysis"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Defense budget broken down by major spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`$${value}B`, "Budget"]} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryBreakdown.map((category, index) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <Badge variant="outline">${category.value}B</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Share of Total Budget</span>
                      <span className="font-semibold">{category.percentage}%</span>
                    </div>
                    <Progress value={category.percentage} className="h-3" />
                    <div className="text-sm text-muted-foreground">
                      {category.name === "Personnel" && "Salaries, benefits, and healthcare for military personnel"}
                      {category.name === "Operations & Maintenance" &&
                        "Training, fuel, maintenance, and day-to-day operations"}
                      {category.name === "Procurement" && "New weapons systems, vehicles, and equipment purchases"}
                      {category.name === "R&D" && "Research, development, testing, and evaluation of new technologies"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {efficiencyMetrics.map((metric) => (
              <Card key={metric.metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant={metric.trend === "up" ? "default" : "destructive"}>{metric.change}</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.metric}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Efficiency Analysis</CardTitle>
              <CardDescription>Comparing cost per personnel across military branches</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={personnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Cost per Person"]} />
                  <Bar dataKey="costPerPerson" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Efficiency Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">High Personnel Costs</h4>
                    <p className="text-sm text-muted-foreground">
                      Average cost per service member has increased 15% over 5 years
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Equipment Maintenance</h4>
                    <p className="text-sm text-muted-foreground">
                      Aging equipment requires 23% more maintenance spending
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Procurement Delays</h4>
                    <p className="text-sm text-muted-foreground">Major programs average 18 months behind schedule</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Base Consolidation</h4>
                    <p className="text-sm text-muted-foreground">
                      Could save $8-12B annually through strategic base closures
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Shared Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Joint logistics and IT services could reduce costs by 15%
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Technology Modernization</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated systems could reduce personnel needs by 8%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Defense Spending Trends (2020-2025)</CardTitle>
              <CardDescription>Historical and projected defense budget changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="budget"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Budget ($B)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">+14.3%</p>
                  <p className="text-sm text-muted-foreground">5-Year Budget Growth</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">+3.7%</p>
                  <p className="text-sm text-muted-foreground">Personnel Growth</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">+10.2%</p>
                  <p className="text-sm text-muted-foreground">Cost per Person</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
