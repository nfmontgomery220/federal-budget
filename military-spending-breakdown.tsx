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
  Legend,
} from "recharts"
import {
  Shield,
  Plane,
  Ship,
  Users,
  Globe,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Target,
  Briefcase,
} from "lucide-react"

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

const branchDetails: Record<
  string,
  {
    breakdown: { category: string; amount: number; fill: string }[]
    forceStructure: { label: string; value: string; icon: any }[]
    contractorSplit: { name: string; value: number; fill: string }[]
  }
> = {
  Army: {
    breakdown: [
      { category: "Personnel", amount: 69, fill: "#10b981" },
      { category: "Operations & Maintenance", amount: 74, fill: "#34d399" },
      { category: "Procurement", amount: 24, fill: "#6ee7b7" },
      { category: "R&D", amount: 14, fill: "#a7f3d0" },
      { category: "Construction", amount: 4, fill: "#d1fae5" },
    ],
    forceStructure: [
      { label: "Active Duty", value: "452,000", icon: Users },
      { label: "National Guard", value: "325,000", icon: Shield },
      { label: "Reserve", value: "174,000", icon: Briefcase },
      { label: "Combat Brigades", value: "31", icon: Target },
    ],
    contractorSplit: [
      { name: "Private Contractors", value: 45, fill: "#f59e0b" },
      { name: "Gov/Internal", value: 55, fill: "#10b981" },
    ],
  },
  Navy: {
    breakdown: [
      { category: "Personnel", amount: 58, fill: "#3b82f6" },
      { category: "Operations & Maintenance", amount: 82, fill: "#60a5fa" },
      { category: "Procurement", amount: 77, fill: "#93c5fd" }, // High due to ships
      { category: "R&D", amount: 27, fill: "#bfdbfe" },
      { category: "Construction", amount: 5, fill: "#dbeafe" },
    ],
    forceStructure: [
      { label: "Active Duty", value: "347,000", icon: Users },
      { label: "Battle Force Ships", value: "296", icon: Ship },
      { label: "Aircraft", value: "3,700+", icon: Plane },
      { label: "Marine Corps", value: "177,000", icon: Shield },
    ],
    contractorSplit: [
      { name: "Private Contractors", value: 65, fill: "#f59e0b" },
      { name: "Gov/Internal", value: 35, fill: "#3b82f6" },
    ],
  },
  "Air Force": {
    breakdown: [
      { category: "Personnel", amount: 42, fill: "#8b5cf6" },
      { category: "Operations & Maintenance", amount: 71, fill: "#a78bfa" },
      { category: "Procurement", amount: 60, fill: "#c4b5fd" },
      { category: "R&D", amount: 46, fill: "#ddd6fe" },
      { category: "Construction", amount: 3, fill: "#ede9fe" },
    ],
    forceStructure: [
      { label: "Active Duty", value: "323,000", icon: Users },
      { label: "Aircraft", value: "5,000+", icon: Plane },
      { label: "ICBMs", value: "400", icon: AlertTriangle },
      { label: "Overseas Bases", value: "76", icon: Globe },
    ],
    contractorSplit: [
      { name: "Private Contractors", value: 70, fill: "#f59e0b" },
      { name: "Gov/Internal", value: 30, fill: "#8b5cf6" },
    ],
  },
  "Space Force": {
    breakdown: [
      { category: "Personnel", amount: 1.2, fill: "#06b6d4" },
      { category: "Operations & Maintenance", amount: 5.8, fill: "#22d3ee" },
      { category: "Procurement", amount: 4.5, fill: "#67e8f9" },
      { category: "R&D", amount: 17.5, fill: "#a5f3fc" }, // R&D heavy
    ],
    forceStructure: [
      { label: "Guardians", value: "8,600", icon: Users },
      { label: "Satellites", value: "150+", icon: Globe },
      { label: "Launch Vehicles", value: "12", icon: Target },
    ],
    contractorSplit: [
      { name: "Private Contractors", value: 85, fill: "#f59e0b" },
      { name: "Gov/Internal", value: 15, fill: "#06b6d4" },
    ],
  },
  "Defense-Wide": {
    breakdown: [
      { category: "Personnel", amount: 0, fill: "#f59e0b" }, // Often included in services or agencies
      { category: "Operations & Maintenance", amount: 105, fill: "#fbbf24" },
      { category: "Procurement", amount: 12, fill: "#fcd34d" },
      { category: "R&D", amount: 36, fill: "#fde68a" },
      { category: "Medical/Health", amount: 60, fill: "#fef3c7" },
      { category: "Intel/Secret", amount: 68, fill: "#fffbeb" },
    ],
    forceStructure: [
      { label: "Civilian Employees", value: "795,000", icon: Briefcase },
      { label: "Intelligence Agencies", value: "18", icon: Shield },
      { label: "Health Beneficiaries", value: "9.6M", icon: Users },
    ],
    contractorSplit: [
      { name: "Private Contractors", value: 50, fill: "#f59e0b" },
      { name: "Gov/Internal", value: 50, fill: "#9ca3af" },
    ],
  },
}

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

          {selectedBranch ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Breakdown Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Breakdown Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>{selectedBranch} Budget Allocation</CardTitle>
                    <CardDescription>Spending distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart layout="vertical" data={branchDetails[selectedBranch].breakdown} margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(val) => `$${val}B`} />
                        <YAxis
                          type="category"
                          dataKey="category"
                          width={150}
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        />
                        <Tooltip formatter={(value) => [`$${value}B`, "Amount"]} cursor={{ fill: "transparent" }} />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                          {branchDetails[selectedBranch].breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Force Structure & Contractor Data */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Force Structure</CardTitle>
                      <CardDescription>Key assets and personnel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {branchDetails[selectedBranch].forceStructure.map((item, idx) => {
                          const ItemIcon = item.icon
                          return (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <ItemIcon className="h-4 w-4 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                              </div>
                              <span className="font-bold text-gray-900">{item.value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contractor vs. Organic</CardTitle>
                      <CardDescription>Spending execution split</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={branchDetails[selectedBranch].contractorSplit}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {branchDetails[selectedBranch].contractorSplit.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-1">Select a Branch</h3>
                  <p>
                    Click on a service branch above to see detailed spending breakdown, force structure, and contractor
                    analysis.
                  </p>
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
