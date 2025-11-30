"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, TrendingUp, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Cluster {
  id: string
  cluster_name: string
  description: string
  member_count: number
  percentage: string
  defense_approach: string
  entitlement_approach: string
  tax_approach: string
}

interface ConsensusData {
  clusters: Cluster[]
  popularPolicies: Array<{
    category: string
    avgValue: number
    support: string
  }>
  totalUsers: number
  districtData?: any[]
}

export default function ConsensusDashboard() {
  const [data, setData] = useState<ConsensusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [zipCode, setZipCode] = useState("")
  const [districtView, setDistrictView] = useState(false)

  useEffect(() => {
    loadConsensusData()
  }, [])

  const loadConsensusData = async (zip?: string) => {
    try {
      setLoading(true)
      const url = zip ? `/api/get-consensus-data?zip=${zip}` : "/api/get-consensus-data"

      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("[v0] Failed to load consensus data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleZipLookup = () => {
    if (zipCode.length === 5) {
      loadConsensusData(zipCode)
      setDistrictView(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing consensus data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Budget Consensus & Coalition Insights</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover how your budget approach compares to {data?.totalUsers.toLocaleString()} other Americans working to
          solve the fiscal crisis
        </p>
      </div>

      {/* District Lookup */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            See What Your District Wants
          </CardTitle>
          <CardDescription>
            Enter your ZIP code to see budget priorities and consensus in your congressional district
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
              maxLength={5}
              className="max-w-xs"
            />
            <Button onClick={handleZipLookup} disabled={zipCode.length !== 5}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View District Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Approach Clusters */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          <Sparkles className="inline h-6 w-6 text-yellow-500 mr-2" />
          Budget Coalitions & Approaches
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.clusters.map((cluster) => (
            <Card key={cluster.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{cluster.cluster_name}</CardTitle>
                <CardDescription className="text-sm">{cluster.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Coalition Size:</span>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {cluster.member_count.toLocaleString()} ({cluster.percentage}%)
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Defense:</span>
                      <span className="font-medium capitalize">{cluster.defense_approach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entitlements:</span>
                      <span className="font-medium capitalize">{cluster.entitlement_approach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span className="font-medium capitalize">{cluster.tax_approach}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Most Popular Policy Choices
          </CardTitle>
          <CardDescription>Budget categories with highest consensus across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.popularPolicies.map((policy, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium capitalize">{policy.category.replace(/_/g, " ")}</div>
                  <div className="text-sm text-gray-600">Average: ${(policy.avgValue / 1000).toFixed(1)}B</div>
                </div>
                <Badge variant="outline" className="text-lg">
                  {policy.support}% Support
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">{data?.totalUsers.toLocaleString()}</div>
            <div className="text-gray-700 mb-4">Americans have created budget proposals using this tool</div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Join the movement to bring data-driven fiscal policy to Congress. Your voice matters - representatives
              respond to constituent engagement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
