"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
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
  ScatterChart,
  Scatter,
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Building,
  Users,
  Globe,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

interface RevenueSource {
  id: string
  name: string
  current: number
  potential: number
  difficulty: number
  timeframe: string
  description: string
  icon: any
  pros: string[]
  cons: string[]
}

const revenueSources: RevenueSource[] = [
  {
    id: "carbon_tax",
    name: "Carbon Tax",
    current: 0,
    potential: 180,
    difficulty: 75,
    timeframe: "2-3 years",
    description: "Tax on carbon emissions to incentivize clean energy",
    icon: Zap,
    pros: ["Environmental benefits", "Broad tax base", "Encourages innovation"],
    cons: ["Regressive impact", "Industry opposition", "Complex implementation"],
  },
  {
    id: "financial_transaction",
    name: "Financial Transaction Tax",
    current: 0,
    potential: 75,
    difficulty: 60,
    timeframe: "1-2 years",
    description: "Small tax on stock, bond, and derivative trades",
    icon: Building,
    pros: ["Reduces speculation", "Stable revenue", "Targets wealthy"],
    cons: ["Market impact", "Enforcement challenges", "International coordination"],
  },
  {
    id: "digital_services",
    name: "Digital Services Tax",
    current: 0,
    potential: 45,
    difficulty: 50,
    timeframe: "1 year",
    description: "Tax on digital advertising and platform revenues",
    icon: Globe,
    pros: ["Targets tech giants", "Growing sector", "International momentum"],
    cons: ["Retaliation risk", "Pass-through to consumers", "Technical complexity"],
  },
  {
    id: "wealth_tax",
    name: "Wealth Tax",
    current: 0,
    potential: 275,
    difficulty: 90,
    timeframe: "3-5 years",
    description: "Annual tax on net worth above $50 million",
    icon: Users,
    pros: ["Addresses inequality", "High revenue potential", "Progressive"],
    cons: ["Constitutional issues", "Valuation challenges", "Capital flight risk"],
  },
  {
    id: "vat",
    name: "Value Added Tax",
    current: 0,
    potential: 400,
    difficulty: 85,
    timeframe: "3-4 years",
    description: "Consumption tax similar to European systems",
    icon: Calculator,
    pros: ["Broad base", "Hard to evade", "Stable revenue"],
    cons: ["Regressive", "Administrative burden", "Political resistance"],
  },
  {
    id: "tax_gap",
    name: "Tax Gap Reduction",
    current: 0,
    potential: 120,
    difficulty: 40,
    timeframe: "2-3 years",
    description: "Enhanced enforcement and compliance measures",
    icon: Target,
    pros: ["No new taxes", "Improves fairness", "Technology-enabled"],
    cons: ["Requires IRS investment", "Diminishing returns", "Taxpayer burden"],
  },
]

export default function RevenueOptimization() {
  const [selectedSources, setSelectedSources] = useState<Record<string, boolean>>({})
  const [implementationLevels, setImplementationLevels] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState("sources")

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) => ({
      ...prev,
      [sourceId]: !prev[sourceId],
    }))
  }

  const handleImplementationChange = (sourceId: string, level: number[]) => {
    setImplementationLevels((prev) => ({
      ...prev,
      [sourceId]: level[0],
    }))
  }

  const calculateOptimizedRevenue = () => {
    return revenueSources.reduce((total, source) => {
      if (selectedSources[source.id]) {
        const implementationLevel = implementationLevels[source.id] || 100
        return total + (source.potential * implementationLevel) / 100
      }
      return total
    }, 0)
  }

  const calculateAverageDifficulty = () => {
    const selectedSourcesList = revenueSources.filter((source) => selectedSources[source.id])
    if (selectedSourcesList.length === 0) return 0

    return selectedSourcesList.reduce((sum, source) => sum + source.difficulty, 0) / selectedSourcesList.length
  }

  const optimizedRevenue = calculateOptimizedRevenue()
  const averageDifficulty = calculateAverageDifficulty()

  const efficiencyData = revenueSources.map((source) => ({
    name: source.name,
    potential: source.potential,
    difficulty: source.difficulty,
    efficiency: source.potential / source.difficulty,
  }))

  const implementationTimeline = [
    { phase: "Year 1", easy: 165, medium: 45, hard: 0 },
    { phase: "Year 2", easy: 165, medium: 120, hard: 0 },
    { phase: "Year 3", easy: 165, medium: 120, hard: 180 },
    { phase: "Year 4", easy: 165, medium: 120, hard: 455 },
    { phase: "Year 5", easy: 165, medium: 120, hard: 675 },
  ]

  const revenueScenarios = [
    { name: "Conservative", revenue: 245, description: "Low-hanging fruit only" },
    { name: "Moderate", revenue: 485, description: "Balanced approach" },
    { name: "Aggressive", revenue: 875, description: "Maximum revenue potential" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Revenue Optimization</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore new revenue sources and optimization strategies to close the fiscal gap. Analyze implementation
          difficulty, revenue potential, and economic impacts of various tax policies.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${optimizedRevenue.toFixed(0)}B</p>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {Object.keys(selectedSources).filter((k) => selectedSources[k]).length}
                </p>
                <p className="text-sm text-muted-foreground">Selected Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{averageDifficulty.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Avg Difficulty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{((optimizedRevenue / 2650) * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Deficit Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Impact Alert */}
      {optimizedRevenue > 500 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Significant Revenue Potential:</strong> Your selected sources could generate $
            {optimizedRevenue.toFixed(0)}B annually, reducing the deficit by{" "}
            {((optimizedRevenue / 2650) * 100).toFixed(0)}%. Consider implementation challenges and economic impacts.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
          <TabsTrigger value="analysis">Efficiency Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid gap-6">
            {revenueSources.map((source) => {
              const Icon = source.icon
              const isSelected = selectedSources[source.id]
              const implementationLevel = implementationLevels[source.id] || 100
              const adjustedRevenue = (source.potential * implementationLevel) / 100

              return (
                <Card key={source.id} className={isSelected ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <span>{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">${adjustedRevenue.toFixed(0)}B</Badge>
                        <Badge
                          variant={
                            source.difficulty < 50 ? "default" : source.difficulty < 75 ? "secondary" : "destructive"
                          }
                        >
                          {source.difficulty < 50 ? "Easy" : source.difficulty < 75 ? "Medium" : "Hard"}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>{source.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Revenue Potential</p>
                        <p className="text-2xl font-bold text-green-600">${source.potential}B</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Implementation Difficulty</p>
                        <div className="flex items-center gap-2">
                          <Progress value={source.difficulty} className="flex-1" />
                          <span className="text-sm font-medium">{source.difficulty}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Timeframe</p>
                        <p className="text-lg font-semibold">{source.timeframe}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Implementation Level</span>
                            <span className="text-sm font-medium">{implementationLevel}%</span>
                          </div>
                          <Slider
                            value={[implementationLevel]}
                            onValueChange={(value) => handleImplementationChange(source.id, value)}
                            min={25}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>25%</span>
                            <span>Adjusted Revenue: ${adjustedRevenue.toFixed(0)}B</span>
                            <span>100%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm text-green-600 mb-2">Advantages</h4>
                            <ul className="text-sm space-y-1">
                              {source.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-red-600 mb-2">Challenges</h4>
                            <ul className="text-sm space-y-1">
                              {source.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleSourceToggle(source.id)}
                      className="w-full"
                    >
                      {isSelected ? "Remove from Plan" : "Add to Revenue Plan"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Efficiency Analysis</CardTitle>
              <CardDescription>Revenue potential vs implementation difficulty</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" name="Difficulty" unit="%" />
                  <YAxis dataKey="potential" name="Revenue" unit="B" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "potential" ? `$${value}B` : `${value}%`,
                      name === "potential" ? "Revenue Potential" : "Implementation Difficulty",
                    ]}
                    labelFormatter={(label) => `Source: ${label}`}
                  />
                  <Scatter dataKey="potential" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Potential Ranking</CardTitle>
                <CardDescription>Sources ranked by total revenue potential</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={efficiencyData.sort((a, b) => b.potential - a.potential)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}B`, "Revenue Potential"]} />
                    <Bar dataKey="potential" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Ranking</CardTitle>
                <CardDescription>Revenue per unit of implementation difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {efficiencyData
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .map((source, index) => (
                      <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{source.efficiency.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Revenue/Difficulty</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueScenarios.map((scenario) => (
              <Card key={scenario.name}>
                <CardHeader>
                  <CardTitle>{scenario.name} Scenario</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">${scenario.revenue}B</p>
                      <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold">{((scenario.revenue / 2650) * 100).toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Deficit Reduction</p>
                    </div>
                    <Progress value={(scenario.revenue / 875) * 100} className="h-3" />
                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>Revenue generation across different implementation approaches</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueScenarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}B`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
              <CardDescription>Revenue rollout by difficulty level over 5 years</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={implementationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="easy" stackId="a" fill="#22c55e" name="Easy ($B)" />
                  <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium ($B)" />
                  <Bar dataKey="hard" stackId="a" fill="#ef4444" name="Hard ($B)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Quick Wins (Year 1)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Tax Gap Reduction</h4>
                    <p className="text-sm text-muted-foreground">Enhanced IRS enforcement: $45B</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Digital Services Tax</h4>
                    <p className="text-sm text-muted-foreground">Tech platform revenues: $45B</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Corporate Loophole Closure</h4>
                    <p className="text-sm text-muted-foreground">Existing law enforcement: $75B</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Implementation Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Legislative Process</h4>
                    <p className="text-sm text-muted-foreground">Budget reconciliation vs regular order</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Administrative Capacity</h4>
                    <p className="text-sm text-muted-foreground">IRS staffing and system upgrades needed</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Economic Transition</h4>
                    <p className="text-sm text-muted-foreground">Phased implementation to minimize disruption</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
