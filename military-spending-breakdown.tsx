"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Plane,
  Ship,
  Users,
  Wrench,
  Globe,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Target,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

interface MilitarySpendingBreakdownProps {
  onBack?: () => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

export default function MilitarySpendingBreakdown({ onBack }: MilitarySpendingBreakdownProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

  // Defense spending data (in billions)
  const totalDefenseSpending = 816

  const byBranch = [
    { name: "Army", amount: 173, percentage: 21.2, icon: Users, color: "#0088FE" },
    { name: "Navy", amount: 165, percentage: 20.2, icon: Ship, color: "#00C49F" },
    { name: "Air Force", amount: 156, percentage: 19.1, icon: Plane, color: "#FFBB28" },
    { name: "Space Force", amount: 24, percentage: 2.9, icon: Globe, color: "#FF8042" },
    { name: "Defense-wide", amount: 298, percentage: 36.5, icon: Shield, color: "#8884D8" },
  ]

  const byCategory = [
    { name: "Personnel", amount: 162, percentage: 19.9, description: "Military and civilian pay, benefits" },
    { name: "Operations & Maintenance", amount: 279, percentage: 34.2, description: "Training, fuel, maintenance" },
    { name: "Procurement", amount: 145, percentage: 17.8, description: "Weapons systems, equipment" },
    { name: "Research & Development", amount: 130, percentage: 15.9, description: "Military R&D programs" },
    { name: "Military Construction", amount: 15, percentage: 1.8, description: "Facilities and infrastructure" },
    { name: "Family Housing", amount: 1.4, percentage: 0.2, description: "Military family housing" },
    { name: "Other", amount: 83.6, percentage: 10.2, description: "Special operations, intelligence" },
  ]

  const majorPrograms = [
    { name: "F-35 Joint Strike Fighter", cost: 12.5, status: "Active", branch: "Multi-Service" },
    { name: "Columbia-class Submarine", cost: 9.9, status: "Development", branch: "Navy" },
    { name: "B-21 Raider Bomber", cost: 8.8, status: "Development", branch: "Air Force" },
    { name: "Ground Based Strategic Deterrent", cost: 7.3, status: "Development", branch: "Air Force" },
    { name: "Virginia-class Submarine", cost: 6.2, status: "Active", branch: "Navy" },
    { name: "KC-46 Tanker", cost: 5.1, status: "Active", branch: "Air Force" },
    { name: "Patriot Missile System", cost: 4.8, status: "Active", branch: "Army" },
    { name: "Aegis Combat System", cost: 4.2, status: "Active", branch: "Navy" },
  ]

  const historicalSpending = [
    { year: 2019, amount: 732, gdpPercent: 3.4 },
    { year: 2020, amount: 778, gdpPercent: 3.7 },
    { year: 2021, amount: 801, gdpPercent: 3.5 },
    { year: 2022, amount: 816, gdpPercent: 3.2 },
    { year: 2023, amount: 816, gdpPercent: 3.1 },
    { year: 2024, amount: 841, gdpPercent: 3.2 },
    { year: 2025, amount: 886, gdpPercent: 3.4 },
  ]

  const internationalComparison = [
    { country: "United States", spending: 816, gdpPercent: 3.4, population: 331 },
    { country: "China", spending: 293, gdpPercent: 1.7, population: 1412 },
    { country: "Russia", spending: 109, gdpPercent: 4.1, population: 144 },
    { country: "India", spending: 76, gdpPercent: 2.4, population: 1380 },
    { country: "Saudi Arabia", spending: 75, gdpPercent: 8.4, population: 35 },
    { country: "United Kingdom", spending: 68, gdpPercent: 2.3, population: 67 },
    { country: "Germany", spending: 56, gdpPercent: 1.4, population: 83 },
    { country: "France", spending: 54, gdpPercent: 1.9, population: 68 },
  ]

  const regionalSpending = [
    { region: "Indo-Pacific", amount: 145, percentage: 17.8, priority: "High" },
    { region: "Europe", amount: 89, percentage: 10.9, priority: "High" },
    { region: "Middle East", amount: 67, percentage: 8.2, priority: "Medium" },
    { region: "Homeland", amount: 298, percentage: 36.5, priority: "High" },
    { region: "Global Operations", amount: 217, percentage: 26.6, priority: "Medium" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Military Spending Analysis</h1>
            <p className="text-muted-foreground">Comprehensive breakdown of U.S. defense spending and priorities</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          FY 2025: ${totalDefenseSpending}B
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${totalDefenseSpending}B</p>
                <p className="text-sm text-muted-foreground">Total Defense</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">3.4%</p>
                <p className="text-sm text-muted-foreground">of GDP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">2.1M</p>
                <p className="text-sm text-muted-foreground">Personnel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Globe className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">39%</p>
                <p className="text-sm text-muted-foreground">Global Share</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Strategic Context:</strong> Defense spending reflects current threats including China's military
          modernization, Russia's aggression, and emerging technologies like AI and hypersonics.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branches">By Branch</TabsTrigger>
          <TabsTrigger value="programs">Major Programs</TabsTrigger>
          <TabsTrigger value="comparison">Global Context</TabsTrigger>
          <TabsTrigger value="regional">Regional Focus</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>How defense dollars are allocated</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={byCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value}B`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Trends</CardTitle>
                <CardDescription>Defense spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalSpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value}B`} />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spending Categories Detail</CardTitle>
              <CardDescription>Breakdown of defense spending by major category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {byCategory.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold">{category.name}</span>
                        <Badge variant="outline">${category.amount}B</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Progress value={category.percentage} className="mt-2 h-2" />
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold">{category.percentage}%</p>
                      <p className="text-sm text-muted-foreground">of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Military Branch</CardTitle>
                <CardDescription>Resource allocation across services</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byBranch}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value}B`} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branch Comparison</CardTitle>
                <CardDescription>Relative spending and capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {byBranch.map((branch) => {
                  const Icon = branch.icon
                  return (
                    <div
                      key={branch.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedBranch === branch.name ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedBranch(selectedBranch === branch.name ? null : branch.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6" style={{ color: branch.color }} />
                          <div>
                            <h3 className="font-semibold">{branch.name}</h3>
                            <p className="text-sm text-muted-foreground">{branch.percentage}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${branch.amount}B</p>
                        </div>
                      </div>
                      {selectedBranch === branch.name && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm">
                            {branch.name === "Army" && "Ground forces, personnel-intensive operations"}
                            {branch.name === "Navy" && "Naval operations, Marine Corps, power projection"}
                            {branch.name === "Air Force" && "Air superiority, strategic deterrence, airlift"}
                            {branch.name === "Space Force" && "Space operations, satellite communications"}
                            {branch.name === "Defense-wide" && "Special operations, intelligence, joint programs"}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Major Defense Programs</CardTitle>
              <CardDescription>Largest weapons systems and acquisition programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {majorPrograms.map((program, index) => (
                  <div key={program.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-semibold">{program.name}</h3>
                        <Badge variant={program.status === "Active" ? "default" : "secondary"}>{program.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{program.branch}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${program.cost}B</p>
                      <p className="text-sm text-muted-foreground">FY 2025</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">$58.4B</p>
                  <p className="text-sm text-muted-foreground">Top 8 Programs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Wrench className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">62%</p>
                  <p className="text-sm text-muted-foreground">In Development</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">$145B</p>
                  <p className="text-sm text-muted-foreground">Total Procurement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Military Spending</CardTitle>
              <CardDescription>How U.S. defense spending compares internationally</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={internationalComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value}B`} />
                  <Bar dataKey="spending" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Comparisons</CardTitle>
                <CardDescription>U.S. vs. other major powers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">U.S. vs. China + Russia</h4>
                  <p className="text-2xl font-bold text-blue-600">$816B vs. $402B</p>
                  <p className="text-sm text-muted-foreground">U.S. spends 2x more than next two combined</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">NATO Allies</h4>
                  <p className="text-2xl font-bold text-green-600">$178B</p>
                  <p className="text-sm text-muted-foreground">Combined UK, Germany, France spending</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Per Capita</h4>
                  <p className="text-2xl font-bold text-purple-600">$2,465</p>
                  <p className="text-sm text-muted-foreground">U.S. defense spending per person</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending as % of GDP</CardTitle>
                <CardDescription>Defense burden relative to economy size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {internationalComparison.slice(0, 6).map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="font-medium">{country.country}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={country.gdpPercent * 10} className="w-20" />
                        <Badge variant="outline">{country.gdpPercent}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Defense Priorities</CardTitle>
              <CardDescription>Geographic allocation of defense resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalSpending.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{region.region}</h3>
                        <Badge
                          variant={
                            region.priority === "High"
                              ? "default"
                              : region.priority === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {region.priority} Priority
                        </Badge>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold">${region.amount}B</p>
                      <p className="text-sm text-muted-foreground">{region.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Focus Areas</CardTitle>
                <CardDescription>Current defense priorities by region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">Indo-Pacific</h4>
                  <p className="text-sm">China containment, Taiwan defense, alliance strengthening</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Europe</h4>
                  <p className="text-sm">NATO support, Ukraine assistance, Russia deterrence</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Middle East</h4>
                  <p className="text-sm">Counter-terrorism, Iran containment, partner support</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Force Posture Changes</CardTitle>
                <CardDescription>Recent shifts in military positioning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pacific Deterrence Initiative</span>
                  <Badge variant="default">+$7.1B</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">European Deterrence Initiative</span>
                  <Badge variant="default">+$4.2B</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Middle East Drawdown</span>
                  <Badge variant="secondary">-$2.8B</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Space Force Expansion</span>
                  <Badge variant="default">+$2.4B</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
