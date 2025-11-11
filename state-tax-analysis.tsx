"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, TrendingDown, DollarSign, Users, Building } from "lucide-react"

interface StateData {
  name: string
  region: string
  population: number
  gdp: number
  federalTaxCollected: number
  federalSpendingReceived: number
  netFlow: number
  perCapitaTax: number
  perCapitaSpending: number
  taxBurdenRank: number
  economicIndicators: {
    unemploymentRate: number
    medianIncome: number
    povertyRate: number
  }
}

const stateData: StateData[] = [
  {
    name: "California",
    region: "West",
    population: 39538223,
    gdp: 3598000,
    federalTaxCollected: 594000,
    federalSpendingReceived: 436000,
    netFlow: -158000,
    perCapitaTax: 15020,
    perCapitaSpending: 11030,
    taxBurdenRank: 6,
    economicIndicators: {
      unemploymentRate: 4.6,
      medianIncome: 84097,
      povertyRate: 11.8,
    },
  },
  {
    name: "Texas",
    region: "South",
    population: 29145505,
    gdp: 2356000,
    federalTaxCollected: 361000,
    federalSpendingReceived: 280000,
    netFlow: -81000,
    perCapitaTax: 12390,
    perCapitaSpending: 9610,
    taxBurdenRank: 32,
    economicIndicators: {
      unemploymentRate: 4.0,
      medianIncome: 67321,
      povertyRate: 13.6,
    },
  },
  {
    name: "New York",
    region: "Northeast",
    population: 20201249,
    gdp: 1994000,
    federalTaxCollected: 367000,
    federalSpendingReceived: 258000,
    netFlow: -109000,
    perCapitaTax: 18170,
    perCapitaSpending: 12770,
    taxBurdenRank: 1,
    economicIndicators: {
      unemploymentRate: 4.3,
      medianIncome: 72108,
      povertyRate: 13.0,
    },
  },
  {
    name: "Florida",
    region: "South",
    population: 21538187,
    gdp: 1036000,
    federalTaxCollected: 230000,
    federalSpendingReceived: 190000,
    netFlow: -40000,
    perCapitaTax: 10680,
    perCapitaSpending: 8820,
    taxBurdenRank: 40,
    economicIndicators: {
      unemploymentRate: 3.2,
      medianIncome: 59227,
      povertyRate: 12.7,
    },
  },
  {
    name: "Kentucky",
    region: "South",
    population: 4505836,
    gdp: 207000,
    federalTaxCollected: 43000,
    federalSpendingReceived: 63000,
    netFlow: 20000,
    perCapitaTax: 9540,
    perCapitaSpending: 13980,
    taxBurdenRank: 35,
    economicIndicators: {
      unemploymentRate: 4.1,
      medianIncome: 52295,
      povertyRate: 16.3,
    },
  },
  {
    name: "West Virginia",
    region: "South",
    population: 1793716,
    gdp: 77000,
    federalTaxCollected: 14000,
    federalSpendingReceived: 24000,
    netFlow: 10000,
    perCapitaTax: 7800,
    perCapitaSpending: 13380,
    taxBurdenRank: 48,
    economicIndicators: {
      unemploymentRate: 3.4,
      medianIncome: 48850,
      povertyRate: 17.9,
    },
  },
]

const regions = ["All", "Northeast", "South", "Midwest", "West"]

export default function StateTaxAnalysis() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const filteredStates =
    selectedRegion === "All" ? stateData : stateData.filter((state) => state.region === selectedRegion)

  const selectedStateData = selectedState ? stateData.find((state) => state.name === selectedState) : null

  const regionalSummary = {
    totalTaxCollected: filteredStates.reduce((sum, state) => sum + state.federalTaxCollected, 0),
    totalSpendingReceived: filteredStates.reduce((sum, state) => sum + state.federalSpendingReceived, 0),
    totalPopulation: filteredStates.reduce((sum, state) => sum + state.population, 0),
    avgUnemployment:
      filteredStates.reduce((sum, state) => sum + state.economicIndicators.unemploymentRate, 0) / filteredStates.length,
  }

  const netFlow = regionalSummary.totalTaxCollected - regionalSummary.totalSpendingReceived

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">State Tax Analysis</h1>
        <p className="text-gray-600">
          Regional breakdown of federal tax collection and spending distribution across states
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedState || "All States"}
          onValueChange={(value) => setSelectedState(value === "All States" ? null : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All States">All States</SelectItem>
            {filteredStates.map((state) => (
              <SelectItem key={state.name} value={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Regional Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Collected</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(regionalSummary.totalTaxCollected / 1000).toFixed(0)}B
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Federal Spending</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(regionalSummary.totalSpendingReceived / 1000).toFixed(0)}B
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Flow</p>
                <p className={`text-2xl font-bold ${netFlow < 0 ? "text-red-600" : "text-green-600"}`}>
                  {netFlow < 0 ? "-" : "+"}${Math.abs(netFlow / 1000).toFixed(0)}B
                </p>
              </div>
              {netFlow < 0 ? (
                <TrendingDown className="h-8 w-8 text-red-600" />
              ) : (
                <TrendingUp className="h-8 w-8 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Unemployment</p>
                <p className="text-2xl font-bold text-gray-900">{regionalSummary.avgUnemployment.toFixed(1)}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Regional Overview</TabsTrigger>
          <TabsTrigger value="rankings">State Rankings</TabsTrigger>
          <TabsTrigger value="economic">Economic Analysis</TabsTrigger>
          <TabsTrigger value="flow">Federal Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {selectedStateData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {selectedStateData.name}
                    </CardTitle>
                    <CardDescription>{selectedStateData.region} Region</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedState(null)}>
                    View All States
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Tax & Spending</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Federal Tax Collected:</span>
                        <span className="font-mono">${(selectedStateData.federalTaxCollected / 1000).toFixed(0)}B</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Federal Spending Received:</span>
                        <span className="font-mono">
                          ${(selectedStateData.federalSpendingReceived / 1000).toFixed(0)}B
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-sm">Net Flow:</span>
                        <span
                          className={`font-mono ${selectedStateData.netFlow < 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {selectedStateData.netFlow < 0 ? "-" : "+"}$
                          {Math.abs(selectedStateData.netFlow / 1000).toFixed(0)}B
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Per Capita</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Tax per Person:</span>
                        <span className="font-mono">${selectedStateData.perCapitaTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Spending per Person:</span>
                        <span className="font-mono">${selectedStateData.perCapitaSpending.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tax Burden Rank:</span>
                        <span className="font-mono">#{selectedStateData.taxBurdenRank}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Economic Indicators</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Unemployment Rate:</span>
                        <span className="font-mono">{selectedStateData.economicIndicators.unemploymentRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Median Income:</span>
                        <span className="font-mono">
                          ${selectedStateData.economicIndicators.medianIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Poverty Rate:</span>
                        <span className="font-mono">{selectedStateData.economicIndicators.povertyRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredStates.map((state) => (
                <Card
                  key={state.name}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedState(state.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{state.name}</h4>
                          <p className="text-sm text-gray-600">
                            {state.region} • Pop: {(state.population / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono ${state.netFlow < 0 ? "text-red-600" : "text-green-600"}`}>
                          {state.netFlow < 0 ? "-" : "+"}${Math.abs(state.netFlow / 1000).toFixed(0)}B
                        </div>
                        <div className="text-sm text-gray-600">Net Flow</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>State Rankings by Tax Burden</CardTitle>
              <CardDescription>Federal tax collection per capita ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...filteredStates]
                  .sort((a, b) => a.taxBurdenRank - b.taxBurdenRank)
                  .map((state, index) => (
                    <div key={state.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-800">
                          {state.taxBurdenRank}
                        </div>
                        <div>
                          <h4 className="font-medium">{state.name}</h4>
                          <p className="text-sm text-gray-600">{state.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">${state.perCapitaTax.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">per capita</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Economic Performance</CardTitle>
                <CardDescription>Key economic indicators by state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStates.map((state) => (
                    <div key={state.name} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{state.name}</h4>
                        <Badge variant="outline">{state.region}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Unemployment</div>
                          <div className="font-mono">{state.economicIndicators.unemploymentRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Median Income</div>
                          <div className="font-mono">${(state.economicIndicators.medianIncome / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Poverty Rate</div>
                          <div className="font-mono">{state.economicIndicators.povertyRate}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Economic Summary</CardTitle>
                <CardDescription>Aggregate economic indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">GDP Contribution</h4>
                    <div className="text-2xl font-bold text-blue-800">
                      ${(filteredStates.reduce((sum, state) => sum + state.gdp, 0) / 1000).toFixed(1)}T
                    </div>
                    <p className="text-sm text-blue-700">Total regional GDP</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Employment</h4>
                    <div className="text-2xl font-bold text-green-800">
                      {regionalSummary.avgUnemployment.toFixed(1)}%
                    </div>
                    <p className="text-sm text-green-700">Average unemployment rate</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Population</h4>
                    <div className="text-2xl font-bold text-purple-800">
                      {(regionalSummary.totalPopulation / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm text-purple-700">Total population</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Federal Money Flow Analysis</CardTitle>
              <CardDescription>
                States that contribute more vs. states that receive more federal funding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-red-800">Net Contributors (Send More Than Receive)</h4>
                    <div className="space-y-2">
                      {filteredStates
                        .filter((state) => state.netFlow < 0)
                        .sort((a, b) => a.netFlow - b.netFlow)
                        .map((state) => (
                          <div key={state.name} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="font-medium">{state.name}</span>
                            <span className="font-mono text-red-600">
                              -${Math.abs(state.netFlow / 1000).toFixed(0)}B
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-green-800">Net Recipients (Receive More Than Send)</h4>
                    <div className="space-y-2">
                      {filteredStates
                        .filter((state) => state.netFlow > 0)
                        .sort((a, b) => b.netFlow - a.netFlow)
                        .map((state) => (
                          <div key={state.name} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="font-medium">{state.name}</span>
                            <span className="font-mono text-green-600">+${(state.netFlow / 1000).toFixed(0)}B</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Regional Net Flow</h4>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${netFlow < 0 ? "text-red-600" : "text-green-600"}`}>
                      {netFlow < 0 ? "-" : "+"}${Math.abs(netFlow / 1000).toFixed(0)}B
                    </div>
                    <p className="text-sm text-gray-600">
                      {netFlow < 0
                        ? "This region sends more to federal government than it receives"
                        : "This region receives more from federal government than it sends"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
