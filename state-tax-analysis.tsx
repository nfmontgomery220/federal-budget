"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Download,
  ChevronRight,
  Search,
  Home,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  PieChart,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// State tax collection data (in billions)
const stateTaxData = {
  2024: {
    total: 4900,
    regions: [
      {
        name: "Northeast",
        total: 1372,
        percentage: 28.0,
        color: "#3b82f6",
        states: 9,
        population: 57400000,
        avgIncome: 72800,
      },
      {
        name: "West",
        total: 1323,
        percentage: 27.0,
        color: "#10b981",
        states: 13,
        population: 78200000,
        avgIncome: 68900,
      },
      {
        name: "South",
        total: 1421,
        percentage: 29.0,
        color: "#f59e0b",
        states: 16,
        population: 125800000,
        avgIncome: 56200,
      },
      {
        name: "Midwest",
        total: 784,
        percentage: 16.0,
        color: "#ef4444",
        states: 12,
        population: 68100000,
        avgIncome: 58900,
      },
    ],
    states: [
      {
        name: "California",
        code: "CA",
        region: "West",
        total: 594.2,
        individual: 412.8,
        corporate: 89.4,
        payroll: 92.0,
        population: 39500000,
        avgIncome: 84097,
        perCapita: 15037,
        federalSpending: 436.8,
        netFlow: 157.4,
        industries: ["Technology", "Entertainment", "Agriculture"],
        topEmployers: ["Apple", "Google", "Meta"],
      },
      {
        name: "Texas",
        code: "TX",
        region: "South",
        total: 365.8,
        individual: 234.2,
        corporate: 67.8,
        payroll: 63.8,
        population: 30000000,
        avgIncome: 64034,
        perCapita: 12193,
        federalSpending: 312.4,
        netFlow: 53.4,
        industries: ["Energy", "Technology", "Aerospace"],
        topEmployers: ["ExxonMobil", "AT&T", "Dell"],
      },
      {
        name: "New York",
        code: "NY",
        region: "Northeast",
        total: 351.2,
        individual: 267.8,
        corporate: 45.2,
        payroll: 38.2,
        population: 19400000,
        avgIncome: 70982,
        perCapita: 18103,
        federalSpending: 258.9,
        netFlow: 92.3,
        industries: ["Finance", "Real Estate", "Media"],
        topEmployers: ["JPMorgan", "Citigroup", "Goldman Sachs"],
      },
      {
        name: "Florida",
        code: "FL",
        region: "South",
        total: 234.6,
        individual: 178.9,
        corporate: 28.4,
        payroll: 27.3,
        population: 22600000,
        avgIncome: 59227,
        perCapita: 10381,
        federalSpending: 267.8,
        netFlow: -33.2,
        industries: ["Tourism", "Agriculture", "Aerospace"],
        topEmployers: ["Disney", "Publix", "NextEra Energy"],
      },
      {
        name: "Illinois",
        code: "IL",
        region: "Midwest",
        total: 156.8,
        individual: 118.9,
        corporate: 23.4,
        payroll: 14.5,
        population: 12600000,
        avgIncome: 69187,
        perCapita: 12444,
        federalSpending: 134.2,
        netFlow: 22.6,
        industries: ["Manufacturing", "Finance", "Agriculture"],
        topEmployers: ["Boeing", "Abbott", "Caterpillar"],
      },
      {
        name: "Pennsylvania",
        code: "PA",
        region: "Northeast",
        total: 145.2,
        individual: 109.8,
        corporate: 19.8,
        payroll: 15.6,
        population: 13000000,
        avgIncome: 63463,
        perCapita: 11169,
        federalSpending: 156.7,
        netFlow: -11.5,
        industries: ["Manufacturing", "Healthcare", "Energy"],
        topEmployers: ["Comcast", "UPMC", "PNC Financial"],
      },
      {
        name: "Ohio",
        code: "OH",
        region: "Midwest",
        total: 123.4,
        individual: 89.2,
        corporate: 18.9,
        payroll: 15.3,
        population: 11800000,
        avgIncome: 58642,
        perCapita: 10458,
        federalSpending: 134.8,
        netFlow: -11.4,
        industries: ["Manufacturing", "Healthcare", "Finance"],
        topEmployers: ["Procter & Gamble", "Kroger", "Progressive"],
      },
      {
        name: "Georgia",
        code: "GA",
        region: "South",
        total: 118.7,
        individual: 89.4,
        corporate: 16.8,
        payroll: 12.5,
        population: 10900000,
        avgIncome: 61224,
        perCapita: 10890,
        federalSpending: 89.2,
        netFlow: 29.5,
        industries: ["Technology", "Logistics", "Agriculture"],
        topEmployers: ["Delta Air Lines", "Home Depot", "UPS"],
      },
      {
        name: "North Carolina",
        code: "NC",
        region: "South",
        total: 112.3,
        individual: 84.6,
        corporate: 15.2,
        payroll: 12.5,
        population: 10700000,
        avgIncome: 56642,
        perCapita: 10495,
        federalSpending: 98.7,
        netFlow: 13.6,
        industries: ["Technology", "Banking", "Textiles"],
        topEmployers: ["Bank of America", "Duke Energy", "Lowe's"],
      },
      {
        name: "New Jersey",
        code: "NJ",
        region: "Northeast",
        total: 134.8,
        individual: 102.3,
        corporate: 18.9,
        payroll: 13.6,
        population: 9300000,
        avgIncome: 85751,
        perCapita: 14495,
        federalSpending: 89.4,
        netFlow: 45.4,
        industries: ["Pharmaceuticals", "Finance", "Technology"],
        topEmployers: ["Johnson & Johnson", "Merck", "Prudential"],
      },
    ],
  },
}

const taxBurdenAnalysis = [
  { state: "CT", perCapita: 19348, avgIncome: 83771, burden: 23.1 },
  { state: "MA", perCapita: 17991, avgIncome: 89645, burden: 20.1 },
  { state: "NY", perCapita: 18103, avgIncome: 70982, burden: 25.5 },
  { state: "NJ", perCapita: 14495, avgIncome: 85751, burden: 16.9 },
  { state: "CA", perCapita: 15037, avgIncome: 84097, burden: 17.9 },
  { state: "WY", perCapita: 8234, avgIncome: 65204, burden: 12.6 },
  { state: "ND", perCapita: 9876, avgIncome: 68131, burden: 14.5 },
  { state: "AK", perCapita: 11234, avgIncome: 77640, burden: 14.5 },
  { state: "TX", perCapita: 12193, avgIncome: 64034, burden: 19.0 },
  { state: "FL", perCapita: 10381, avgIncome: 59227, burden: 17.5 },
]

const economicIndicators = [
  { year: 2020, gdp: 21060, taxes: 3421, rate: 16.2 },
  { year: 2021, gdp: 23315, taxes: 4047, rate: 17.4 },
  { year: 2022, gdp: 25462, taxes: 4896, rate: 19.2 },
  { year: 2023, gdp: 26854, taxes: 4439, rate: 16.5 },
  { year: 2024, gdp: 28230, taxes: 4900, rate: 17.4 },
]

interface StateTaxAnalysisProps {
  onBack?: () => void
}

export default function StateTaxAnalysis({ onBack }: StateTaxAnalysisProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [sortBy, setSortBy] = useState("total")

  const currentData = stateTaxData[selectedYear as keyof typeof stateTaxData]

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

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const resetToOverview = () => {
    console.log("Resetting to overview") // Debug log
    setSelectedRegion(null)
    setSelectedState(null)
    setActiveTab("overview")
    setSearchTerm("")
  }

  const goBackToRegion = () => {
    setSelectedState(null)
  }

  const getStateData = (stateName: string) => {
    return currentData.states.find((state) => state.name === stateName)
  }

  const getRegionData = (regionName: string) => {
    return currentData.regions.find((region) => region.name === regionName)
  }

  const filteredStates = currentData.states
    .filter((state) => state.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "total":
          return b.total - a.total
        case "perCapita":
          return b.perCapita - a.perCapita
        case "population":
          return b.population - a.population
        default:
          return b.total - a.total
      }
    })

  const getBreadcrumb = () => {
    if (selectedState && selectedRegion) {
      return `Tax Analysis > ${selectedRegion} > ${selectedState}`
    } else if (selectedRegion) {
      return `Tax Analysis > ${selectedRegion}`
    } else if (selectedState) {
      return `Tax Analysis > ${selectedState}`
    }
    return "Federal Tax Collection by State"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {onBack ? (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Federal Overview
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={resetToOverview}>
                  <Home className="h-4 w-4 mr-1" />
                  Overview
                </Button>
              )}
              {(selectedRegion || selectedState) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectedState && selectedRegion ? goBackToRegion : resetToOverview}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {selectedState && selectedRegion ? "Back to Region" : "Back"}
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedState
                    ? `${selectedState} Tax Analysis`
                    : selectedRegion
                      ? `${selectedRegion} Region Analysis`
                      : "State Tax Collection Analysis"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{getBreadcrumb()}</p>
              </div>
            </div>
            <p className="text-gray-600">
              {selectedState
                ? `Detailed federal tax collection analysis for ${selectedState}`
                : selectedRegion
                  ? `Regional breakdown of federal tax collection in the ${selectedRegion}`
                  : "Federal tax collection breakdown by state and region"}
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
              <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatBillions(currentData.total)}</div>
              <p className="text-xs text-muted-foreground">Across all states</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top State</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">California</div>
              <p className="text-xs text-muted-foreground">{formatBillions(594.2)} collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Per Capita</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Connecticut</div>
              <p className="text-xs text-muted-foreground">$19,348 per person</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regional Leader</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">South</div>
              <p className="text-xs text-muted-foreground">29% of total collection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Regional Overview</TabsTrigger>
            <TabsTrigger value="states">State Rankings</TabsTrigger>
            <TabsTrigger value="analysis">Economic Analysis</TabsTrigger>
            <TabsTrigger value="flows">Federal Flows</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {!selectedRegion && !selectedState ? (
              // Main Regional Overview - This should always show when nothing is selected
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Collection by Region</CardTitle>
                    <CardDescription>Federal tax revenue distribution across US regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        total: { label: "Total", color: "hsl(var(--chart-1))" },
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
                                      {formatBillions(data.total)} ({data.percentage}%)
                                    </p>
                                    <p className="text-xs text-gray-500">{formatNumber(data.population)} population</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <PieChart data={currentData.regions}>
                            {currentData.regions.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </PieChart>
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Breakdown</CardTitle>
                    <CardDescription>Click on any region for detailed state analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentData.regions.map((region, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => setSelectedRegion(region.name)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${region.color}20` }}>
                              <MapPin className="h-5 w-5" style={{ color: region.color }} />
                            </div>
                            <div>
                              <div className="font-medium">{region.name}</div>
                              <div className="text-sm text-gray-600">
                                {region.states} states • {formatNumber(region.population)} population
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-bold">{formatBillions(region.total)}</div>
                              <div className="text-sm text-gray-600">{region.percentage}%</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : selectedRegion && !selectedState ? (
              // Region Detail View
              <div className="space-y-6">
                {(() => {
                  const regionData = getRegionData(selectedRegion)
                  const regionStates = currentData.states.filter((state) => state.region === selectedRegion)

                  if (!regionData) return null

                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-6 w-6" style={{ color: regionData.color }} />
                              <div>
                                <div className="text-2xl font-bold">{formatBillions(regionData.total)}</div>
                                <div className="text-sm text-gray-600">Total Collection</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Users className="h-6 w-6 text-blue-600" />
                              <div>
                                <div className="text-2xl font-bold">{formatNumber(regionData.population)}</div>
                                <div className="text-sm text-gray-600">Population</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-6 w-6 text-green-600" />
                              <div>
                                <div className="text-2xl font-bold">${formatNumber(regionData.avgIncome)}</div>
                                <div className="text-sm text-gray-600">Avg Income</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-6 w-6 text-purple-600" />
                              <div>
                                <div className="text-2xl font-bold">{regionData.states}</div>
                                <div className="text-sm text-gray-600">States</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>States in {selectedRegion}</CardTitle>
                          <CardDescription>Click on any state for detailed analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {regionStates.map((state, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => setSelectedState(state.name)}
                              >
                                <div>
                                  <div className="font-medium">{state.name}</div>
                                  <div className="text-sm text-gray-600">
                                    Pop: {formatNumber(state.population)} • Per capita: ${formatNumber(state.perCapita)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="font-bold">{formatBillions(state.total)}</div>
                                    <Badge variant={state.netFlow > 0 ? "default" : "secondary"} className="text-xs">
                                      {state.netFlow > 0 ? "Donor" : "Recipient"}
                                    </Badge>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                })()}
              </div>
            ) : selectedState ? (
              // State Detail View
              <div className="space-y-6">
                {(() => {
                  const stateData = getStateData(selectedState)
                  if (!stateData) return null

                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-6 w-6 text-green-600" />
                              <div>
                                <div className="text-2xl font-bold">{formatBillions(stateData.total)}</div>
                                <div className="text-sm text-gray-600">Total Collection</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Users className="h-6 w-6 text-blue-600" />
                              <div>
                                <div className="text-2xl font-bold">${formatNumber(stateData.perCapita)}</div>
                                <div className="text-sm text-gray-600">Per Capita</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-6 w-6 text-purple-600" />
                              <div>
                                <div className="text-2xl font-bold">${formatNumber(stateData.avgIncome)}</div>
                                <div className="text-sm text-gray-600">Avg Income</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              {stateData.netFlow > 0 ? (
                                <TrendingUp className="h-6 w-6 text-green-600" />
                              ) : (
                                <TrendingDown className="h-6 w-6 text-red-600" />
                              )}
                              <div>
                                <div
                                  className={`text-2xl font-bold ${
                                    stateData.netFlow > 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {formatBillions(Math.abs(stateData.netFlow))}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {stateData.netFlow > 0 ? "Net Contributor" : "Net Recipient"}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Tax Collection Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">Individual Income Tax</span>
                                  <span className="font-bold">{formatBillions(stateData.individual)}</span>
                                </div>
                                <Progress value={(stateData.individual / stateData.total) * 100} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">Corporate Income Tax</span>
                                  <span className="font-bold">{formatBillions(stateData.corporate)}</span>
                                </div>
                                <Progress value={(stateData.corporate / stateData.total) * 100} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">Payroll Taxes</span>
                                  <span className="font-bold">{formatBillions(stateData.payroll)}</span>
                                </div>
                                <Progress value={(stateData.payroll / stateData.total) * 100} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Economic Profile</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Key Industries</h4>
                              <div className="flex flex-wrap gap-2">
                                {stateData.industries.map((industry, index) => (
                                  <Badge key={index} variant="outline">
                                    {industry}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Major Employers</h4>
                              <div className="space-y-1">
                                {stateData.topEmployers.map((employer, index) => (
                                  <div key={index} className="text-sm text-gray-600">
                                    • {employer}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="text-sm text-gray-600">
                                Population: {formatNumber(stateData.population)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Federal Spending: {formatBillions(stateData.federalSpending)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              // Fallback - show main overview
              <div className="text-center p-8">
                <p className="text-gray-500">Loading overview...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="states" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Sort by Total Collection</SelectItem>
                  <SelectItem value="perCapita">Sort by Per Capita</SelectItem>
                  <SelectItem value="population">Sort by Population</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStates.map((state, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedState(state.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{state.name}</CardTitle>
                        <CardDescription>{state.region} Region</CardDescription>
                      </div>
                      <Badge variant={state.netFlow > 0 ? "default" : "secondary"}>
                        {state.netFlow > 0 ? "Donor" : "Recipient"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Collection</span>
                        <span className="font-bold">{formatBillions(state.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Per Capita</span>
                        <span className="font-medium">${formatNumber(state.perCapita)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Population</span>
                        <span className="font-medium">{formatNumber(state.population)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Income</span>
                        <span className="font-medium">${formatNumber(state.avgIncome)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Burden vs Income</CardTitle>
                  <CardDescription>Per capita tax collection vs average income by state</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      burden: { label: "Tax Burden %", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={taxBurdenAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="avgIncome" name="Average Income" />
                        <YAxis dataKey="perCapita" name="Per Capita Tax" />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{data.state}</p>
                                  <p className="text-sm text-gray-600">Income: ${formatNumber(data.avgIncome)}</p>
                                  <p className="text-sm text-gray-600">Per Capita: ${formatNumber(data.perCapita)}</p>
                                  <p className="text-sm text-gray-600">Burden: {data.burden}%</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Scatter dataKey="perCapita" fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Economic Correlation</CardTitle>
                  <CardDescription>Federal tax collection vs national GDP trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      gdp: { label: "GDP", color: "hsl(var(--chart-2))" },
                      taxes: { label: "Tax Collection", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={economicIndicators}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.name}: ${formatNumber(entry.value as number)}T
                                    </p>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="gdp" stroke="var(--color-gdp)" strokeWidth={3} />
                        <Line type="monotone" dataKey="taxes" stroke="var(--color-taxes)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Analysis of state tax collection patterns</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">High-Income States</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Connecticut, Massachusetts, and New York have the highest per-capita tax contributions, reflecting
                    higher income levels and progressive tax structure.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Economic Powerhouses</h4>
                  <p className="text-sm text-green-700 mt-1">
                    California and Texas together contribute 19.6% of total federal tax revenue, driven by large
                    populations and strong economies.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Regional Balance</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    The South leads in total collection (29%) due to population size, while the Northeast has the
                    highest per-capita rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Federal Tax vs Spending Flows</CardTitle>
                <CardDescription>
                  Net federal money flow by state (positive = donor, negative = recipient)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    netFlow: { label: "Net Flow", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.states.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="code" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const value = payload[0].value as number
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-gray-600">Net Flow: {formatBillions(Math.abs(value))}</p>
                                <p className="text-xs text-gray-500">{value > 0 ? "Donor State" : "Recipient State"}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar
                        dataKey="netFlow"
                        fill={(entry) => (entry.netFlow > 0 ? "#10b981" : "#ef4444")}
                        name="Net Flow"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Donor States</CardTitle>
                  <CardDescription>States contributing more than they receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.states
                      .filter((state) => state.netFlow > 0)
                      .sort((a, b) => b.netFlow - a.netFlow)
                      .slice(0, 5)
                      .map((state, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <div>
                            <div className="font-medium">{state.name}</div>
                            <div className="text-sm text-gray-600">
                              Collects: {formatBillions(state.total)} • Receives:{" "}
                              {formatBillions(state.federalSpending)}
                            </div>
                          </div>
                          <div className="font-bold text-green-600">+{formatBillions(state.netFlow)}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Recipient States</CardTitle>
                  <CardDescription>States receiving more than they contribute</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.states
                      .filter((state) => state.netFlow < 0)
                      .sort((a, b) => a.netFlow - b.netFlow)
                      .slice(0, 5)
                      .map((state, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <div>
                            <div className="font-medium">{state.name}</div>
                            <div className="text-sm text-gray-600">
                              Collects: {formatBillions(state.total)} • Receives:{" "}
                              {formatBillions(state.federalSpending)}
                            </div>
                          </div>
                          <div className="font-bold text-red-600">{formatBillions(state.netFlow)}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
