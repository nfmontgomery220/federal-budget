"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Heart,
  Users,
  GraduationCap,
  Building,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react"

interface SpendingCategory {
  id: string
  name: string
  type: "defense" | "social"
  current: number
  proposed: number
  min: number
  max: number
  description: string
  icon: any
  priority: "High" | "Medium" | "Low"
  publicSupport: number
}

const spendingCategories: SpendingCategory[] = [
  // Defense Categories
  {
    id: "military-personnel",
    name: "Military Personnel",
    type: "defense",
    current: 165,
    proposed: 165,
    min: 120,
    max: 200,
    description: "Active duty pay, benefits, and retirement",
    icon: Shield,
    priority: "High",
    publicSupport: 78,
  },
  {
    id: "operations-maintenance",
    name: "Operations & Maintenance",
    type: "defense",
    current: 280,
    proposed: 280,
    min: 200,
    max: 350,
    description: "Training, fuel, equipment maintenance",
    icon: Shield,
    priority: "High",
    publicSupport: 65,
  },
  {
    id: "procurement",
    name: "Procurement",
    type: "defense",
    current: 170,
    proposed: 170,
    min: 100,
    max: 250,
    description: "New weapons systems and equipment purchases",
    icon: Shield,
    priority: "Medium",
    publicSupport: 45,
  },
  {
    id: "rnd-defense",
    name: "Research & Development",
    type: "defense",
    current: 140,
    proposed: 140,
    min: 80,
    max: 200,
    description: "Military technology research and development",
    icon: Shield,
    priority: "Medium",
    publicSupport: 52,
  },
  {
    id: "military-construction",
    name: "Military Construction",
    type: "defense",
    current: 25,
    proposed: 25,
    min: 15,
    max: 50,
    description: "Base construction and facility upgrades",
    icon: Building,
    priority: "Low",
    publicSupport: 38,
  },
  {
    id: "overseas-operations",
    name: "Overseas Operations",
    type: "defense",
    current: 106,
    proposed: 106,
    min: 50,
    max: 150,
    description: "Foreign military operations and bases",
    icon: Shield,
    priority: "Medium",
    publicSupport: 42,
  },

  // Social Categories
  {
    id: "healthcare",
    name: "Healthcare Programs",
    type: "social",
    current: 1635,
    proposed: 1635,
    min: 1400,
    max: 2000,
    description: "Medicare, Medicaid, and health services",
    icon: Heart,
    priority: "High",
    publicSupport: 85,
  },
  {
    id: "social-security",
    name: "Social Security",
    type: "social",
    current: 1347,
    proposed: 1347,
    min: 1200,
    max: 1500,
    description: "Retirement and disability benefits",
    icon: Users,
    priority: "High",
    publicSupport: 89,
  },
  {
    id: "education",
    name: "Education",
    type: "social",
    current: 80,
    proposed: 80,
    min: 60,
    max: 150,
    description: "K-12, higher education, and training programs",
    icon: GraduationCap,
    priority: "High",
    publicSupport: 82,
  },
  {
    id: "housing-assistance",
    name: "Housing Assistance",
    type: "social",
    current: 55,
    proposed: 55,
    min: 30,
    max: 100,
    description: "Public housing and rental assistance",
    icon: Building,
    priority: "Medium",
    publicSupport: 68,
  },
  {
    id: "nutrition-assistance",
    name: "Nutrition Assistance",
    type: "social",
    current: 95,
    proposed: 95,
    min: 70,
    max: 130,
    description: "SNAP, WIC, and school meal programs",
    icon: Heart,
    priority: "High",
    publicSupport: 74,
  },
  {
    id: "unemployment-benefits",
    name: "Unemployment Benefits",
    type: "social",
    current: 45,
    proposed: 45,
    min: 30,
    max: 80,
    description: "Unemployment insurance and job training",
    icon: Users,
    priority: "Medium",
    publicSupport: 71,
  },
]

export default function GunsVsButterAnalysis() {
  const [categories, setCategories] = useState<SpendingCategory[]>(spendingCategories)
  const [balanceTarget, setBalanceTarget] = useState(50) // 50% defense, 50% social
  const [showOptimized, setShowOptimized] = useState(false)

  const updateCategory = (id: string, newValue: number) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, proposed: newValue } : cat)))
  }

  const calculateTotals = () => {
    const defenseTotal = categories.filter((cat) => cat.type === "defense").reduce((sum, cat) => sum + cat.proposed, 0)

    const socialTotal = categories.filter((cat) => cat.type === "social").reduce((sum, cat) => sum + cat.proposed, 0)

    const totalSpending = defenseTotal + socialTotal
    const defensePercent = (defenseTotal / totalSpending) * 100
    const socialPercent = (socialTotal / totalSpending) * 100

    const currentDefenseTotal = categories
      .filter((cat) => cat.type === "defense")
      .reduce((sum, cat) => sum + cat.current, 0)

    const currentSocialTotal = categories
      .filter((cat) => cat.type === "social")
      .reduce((sum, cat) => sum + cat.current, 0)

    const defenseChange = defenseTotal - currentDefenseTotal
    const socialChange = socialTotal - currentSocialTotal
    const totalChange = defenseChange + socialChange

    return {
      defenseTotal,
      socialTotal,
      totalSpending,
      defensePercent,
      socialPercent,
      defenseChange,
      socialChange,
      totalChange,
      currentDefenseTotal,
      currentSocialTotal,
    }
  }

  const optimizeForBalance = () => {
    const totals = calculateTotals()
    const targetDefenseTotal = (totals.totalSpending * balanceTarget) / 100
    const targetSocialTotal = totals.totalSpending - targetDefenseTotal

    // Proportionally adjust defense spending
    const defenseCategories = categories.filter((cat) => cat.type === "defense")
    const defenseAdjustmentFactor = targetDefenseTotal / totals.defenseTotal

    // Proportionally adjust social spending
    const socialCategories = categories.filter((cat) => cat.type === "social")
    const socialAdjustmentFactor = targetSocialTotal / totals.socialTotal

    const optimizedCategories = categories.map((cat) => {
      if (cat.type === "defense") {
        const newValue = Math.max(cat.min, Math.min(cat.max, cat.proposed * defenseAdjustmentFactor))
        return { ...cat, proposed: Math.round(newValue) }
      } else {
        const newValue = Math.max(cat.min, Math.min(cat.max, cat.proposed * socialAdjustmentFactor))
        return { ...cat, proposed: Math.round(newValue) }
      }
    })

    setCategories(optimizedCategories)
    setShowOptimized(true)
  }

  const resetToBaseline = () => {
    setCategories(spendingCategories.map((cat) => ({ ...cat, proposed: cat.current })))
    setShowOptimized(false)
  }

  const totals = calculateTotals()
  const isBalanced = Math.abs(totals.defensePercent - balanceTarget) < 5

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guns vs Butter Analysis</h1>
        <p className="text-gray-600">
          Balance military spending with social programs to address the deficit while maintaining national priorities
        </p>
      </div>

      {/* Current Balance Display */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${(totals.defenseTotal / 1000).toFixed(1)}T</div>
              <div className="text-sm text-gray-600">Defense Spending</div>
              <div className="text-xs text-gray-500">{totals.defensePercent.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${(totals.socialTotal / 1000).toFixed(1)}T</div>
              <div className="text-sm text-gray-600">Social Spending</div>
              <div className="text-xs text-gray-500">{totals.socialPercent.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">${(totals.totalSpending / 1000).toFixed(1)}T</div>
              <div className="text-sm text-gray-600">Total Spending</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totals.totalChange > 0 ? "text-red-600" : "text-green-600"}`}>
                {totals.totalChange > 0 ? "+" : ""}${(totals.totalChange / 1000).toFixed(1)}T
              </div>
              <div className="text-sm text-gray-600">Change from Current</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Defense vs Social Balance</span>
              <span>Target: {balanceTarget}% Defense</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${totals.defensePercent}%` }}
              >
                {totals.defensePercent > 15 && `${totals.defensePercent.toFixed(0)}%`}
              </div>
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${totals.socialPercent}%` }}
              >
                {totals.socialPercent > 15 && `${totals.socialPercent.toFixed(0)}%`}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Target Defense Percentage:</label>
              <Slider
                value={[balanceTarget]}
                onValueChange={(value) => setBalanceTarget(value[0])}
                min={20}
                max={80}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20%</span>
                <span>50%</span>
                <span>80%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={optimizeForBalance} variant="outline">
                Optimize Balance
              </Button>
              <Button onClick={resetToBaseline} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {isBalanced && (
            <Alert className="border-green-200 bg-green-50 mt-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Balanced!</strong> Your spending allocation is within 5% of your target balance.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Spending Categories</TabsTrigger>
          <TabsTrigger value="comparison">Defense vs Social</TabsTrigger>
          <TabsTrigger value="tradeoffs">Trade-off Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Defense Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Shield className="h-5 w-5" />
                  Defense Spending
                </CardTitle>
                <CardDescription>
                  ${(totals.defenseTotal / 1000).toFixed(1)}T total • {totals.defensePercent.toFixed(1)}% of combined
                  spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories
                    .filter((cat) => cat.type === "defense")
                    .map((category) => {
                      const Icon = category.icon
                      const change = category.proposed - category.current
                      const changePercent = (change / category.current) * 100

                      return (
                        <div key={category.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-red-600" />
                              <div>
                                <h4 className="font-medium">{category.name}</h4>
                                <p className="text-xs text-gray-600">{category.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${category.proposed}B</div>
                              {change !== 0 && (
                                <div className={`text-xs ${change > 0 ? "text-red-600" : "text-green-600"}`}>
                                  {change > 0 ? "+" : ""}${change}B ({changePercent.toFixed(1)}%)
                                </div>
                              )}
                            </div>
                          </div>

                          <Slider
                            value={[category.proposed]}
                            onValueChange={(value) => updateCategory(category.id, value[0])}
                            min={category.min}
                            max={category.max}
                            step={5}
                            className="w-full mb-2"
                          />

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">
                              ${category.min}B - ${category.max}B
                            </span>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {category.priority} Priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {category.publicSupport}% Support
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Social Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Heart className="h-5 w-5" />
                  Social Spending
                </CardTitle>
                <CardDescription>
                  ${(totals.socialTotal / 1000).toFixed(1)}T total • {totals.socialPercent.toFixed(1)}% of combined
                  spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories
                    .filter((cat) => cat.type === "social")
                    .map((category) => {
                      const Icon = category.icon
                      const change = category.proposed - category.current
                      const changePercent = (change / category.current) * 100

                      return (
                        <div key={category.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <div>
                                <h4 className="font-medium">{category.name}</h4>
                                <p className="text-xs text-gray-600">{category.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${category.proposed}B</div>
                              {change !== 0 && (
                                <div className={`text-xs ${change > 0 ? "text-red-600" : "text-green-600"}`}>
                                  {change > 0 ? "+" : ""}${change}B ({changePercent.toFixed(1)}%)
                                </div>
                              )}
                            </div>
                          </div>

                          <Slider
                            value={[category.proposed]}
                            onValueChange={(value) => updateCategory(category.id, value[0])}
                            min={category.min}
                            max={category.max}
                            step={5}
                            className="w-full mb-2"
                          />

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">
                              ${category.min}B - ${category.max}B
                            </span>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {category.priority} Priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {category.publicSupport}% Support
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Defense Spending Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-800">${(totals.defenseTotal / 1000).toFixed(1)}T</div>
                    <div className="text-sm text-red-600">Total Defense Spending</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {totals.defenseChange > 0 ? "+" : ""}${(totals.defenseChange / 1000).toFixed(1)}T from current
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Largest Defense Categories:</h4>
                    {categories
                      .filter((cat) => cat.type === "defense")
                      .sort((a, b) => b.proposed - a.proposed)
                      .slice(0, 3)
                      .map((cat, index) => (
                        <div key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {index + 1}. {cat.name}
                          </span>
                          <span className="font-mono text-sm">${cat.proposed}B</span>
                        </div>
                      ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Public Support Analysis:</h4>
                    <div className="text-sm text-gray-600">
                      Average public support:{" "}
                      {(
                        categories
                          .filter((cat) => cat.type === "defense")
                          .reduce((sum, cat) => sum + cat.publicSupport, 0) /
                        categories.filter((cat) => cat.type === "defense").length
                      ).toFixed(0)}
                      %
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Social Spending Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-800">${(totals.socialTotal / 1000).toFixed(1)}T</div>
                    <div className="text-sm text-blue-600">Total Social Spending</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {totals.socialChange > 0 ? "+" : ""}${(totals.socialChange / 1000).toFixed(1)}T from current
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Largest Social Categories:</h4>
                    {categories
                      .filter((cat) => cat.type === "social")
                      .sort((a, b) => b.proposed - a.proposed)
                      .slice(0, 3)
                      .map((cat, index) => (
                        <div key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {index + 1}. {cat.name}
                          </span>
                          <span className="font-mono text-sm">${cat.proposed}B</span>
                        </div>
                      ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Public Support Analysis:</h4>
                    <div className="text-sm text-gray-600">
                      Average public support:{" "}
                      {(
                        categories
                          .filter((cat) => cat.type === "social")
                          .reduce((sum, cat) => sum + cat.publicSupport, 0) /
                        categories.filter((cat) => cat.type === "social").length
                      ).toFixed(0)}
                      %
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historical Context</CardTitle>
              <CardDescription>How current spending compares to historical averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Cold War Era (1960s-1980s)</h4>
                  <div className="text-lg font-bold text-red-600">~60%</div>
                  <div className="text-sm text-gray-600">Defense share of discretionary spending</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Post-Cold War (1990s-2000s)</h4>
                  <div className="text-lg font-bold text-purple-600">~50%</div>
                  <div className="text-sm text-gray-600">More balanced allocation</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Current (2025)</h4>
                  <div className="text-lg font-bold text-blue-600">{totals.defensePercent.toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Your current allocation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tradeoffs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Trade-off Analysis
              </CardTitle>
              <CardDescription>
                Understanding the implications of shifting spending between defense and social programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Reducing Defense Spending</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>More funds available for social programs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Reduced deficit pressure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Potential national security risks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Defense industry job losses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>Political resistance from defense hawks</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-800 mb-2">Reducing Social Spending</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Lower government spending overall</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Potential for tax reductions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Increased poverty and inequality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Reduced economic safety net</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>Strong public opposition</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Economic Impact Analysis</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-800">Defense Spending Multiplier</h5>
                      <p className="text-gray-600">
                        Every $1 in defense spending generates approximately $1.40 in economic activity
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Social Spending Multiplier</h5>
                      <p className="text-gray-600">
                        Every $1 in social spending generates approximately $1.60 in economic activity
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Deficit Impact</h5>
                      <p className="text-gray-600">
                        Current changes would {totals.totalChange > 0 ? "increase" : "decrease"} deficit by $
                        {Math.abs(totals.totalChange / 1000).toFixed(1)}T
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Defense Priority</CardTitle>
                <CardDescription>Emphasize national security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-800">65%</div>
                    <div className="text-sm text-red-600">Defense Share</div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setBalanceTarget(65)
                      optimizeForBalance()
                    }}
                  >
                    Apply Scenario
                  </Button>
                  <div className="text-xs text-gray-600">
                    <strong>Pros:</strong> Strong defense, global leadership
                    <br />
                    <strong>Cons:</strong> Limited social programs, higher inequality
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Balanced Approach</CardTitle>
                <CardDescription>Equal emphasis on both priorities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-800">50%</div>
                    <div className="text-sm text-purple-600">Defense Share</div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setBalanceTarget(50)
                      optimizeForBalance()
                    }}
                  >
                    Apply Scenario
                  </Button>
                  <div className="text-xs text-gray-600">
                    <strong>Pros:</strong> Moderate approach, broad support
                    <br />
                    <strong>Cons:</strong> May not fully address either priority
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Social Priority</CardTitle>
                <CardDescription>Focus on domestic programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">35%</div>
                    <div className="text-sm text-blue-600">Defense Share</div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setBalanceTarget(35)
                      optimizeForBalance()
                    }}
                  >
                    Apply Scenario
                  </Button>
                  <div className="text-xs text-gray-600">
                    <strong>Pros:</strong> Strong social safety net, reduced inequality
                    <br />
                    <strong>Cons:</strong> Potential security vulnerabilities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Impact Summary</CardTitle>
              <CardDescription>How different approaches affect the deficit and priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Configuration Impact</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Spending Change:</span>
                      <div
                        className={`font-mono font-bold ${totals.totalChange > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {totals.totalChange > 0 ? "+" : ""}${(totals.totalChange / 1000).toFixed(1)}T
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Defense Balance:</span>
                      <div className="font-mono font-bold">{totals.defensePercent.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Social Balance:</span>
                      <div className="font-mono font-bold">{totals.socialPercent.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Deficit Impact:</span>
                      <div
                        className={`font-mono font-bold ${totals.totalChange > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        ${((2650 + totals.totalChange) / 1000).toFixed(1)}T
                      </div>
                    </div>
                  </div>
                </div>

                {Math.abs(totals.totalChange) > 100 && (
                  <Alert
                    className={totals.totalChange > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Significant Change Detected:</strong>
                      {totals.totalChange > 0 ? (
                        <span className="text-red-800">
                          Your changes would increase spending by ${(Math.abs(totals.totalChange) / 1000).toFixed(1)}T,
                          worsening the deficit. Consider offsetting cuts or revenue increases.
                        </span>
                      ) : (
                        <span className="text-green-800">
                          Your changes would reduce spending by ${(Math.abs(totals.totalChange) / 1000).toFixed(1)}T,
                          improving the deficit by {((Math.abs(totals.totalChange) / 2650) * 100).toFixed(1)}%.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
