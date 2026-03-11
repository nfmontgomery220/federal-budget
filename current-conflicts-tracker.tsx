"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  AreaChart,
  Area,
} from "recharts"
import {
  Globe,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  Plane,
  Ship,
  RefreshCw,
  Clock,
  MapPin,
  Crosshair,
  Bomb,
  ChevronRight,
  Activity,
} from "lucide-react"

interface ConflictData {
  id: string
  conflict_name: string
  region: string
  fiscal_year: number
  total_spending: number
  military_aid: number
  economic_aid: number
  humanitarian_aid: number
  operations_cost: number
  description: string
  status: string
  start_date: string
  key_programs: string[]
  weapons_provided: Array<{
    name: string
    quantity: number
    value: number
    note?: string
  }>
}

interface TimelineEvent {
  event_date: string
  conflict_id: string
  event_type: string
  title: string
  description: string
  amount: number
}

interface ConflictSummary {
  total_conflict_spending: number
  total_military_aid: number
  total_economic_aid: number
  total_humanitarian_aid: number
  total_operations_cost: number
  active_conflicts: number
  regions_involved: string[]
}

const REGION_COLORS: Record<string, string> = {
  Europe: "#3b82f6",
  "Middle East": "#f59e0b",
  "Indo-Pacific": "#10b981",
  Africa: "#8b5cf6",
  Global: "#ef4444",
}

const AID_TYPE_COLORS = {
  military_aid: "#ef4444",
  economic_aid: "#3b82f6",
  humanitarian_aid: "#10b981",
  operations_cost: "#f59e0b",
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  }
  return `$${value.toLocaleString()}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function CurrentConflictsTracker() {
  const [conflicts, setConflicts] = useState<ConflictData[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [summary, setSummary] = useState<ConflictSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchConflictData()
  }, [])

  async function fetchConflictData() {
    try {
      setLoading(true)
      const response = await fetch("/api/conflicts?fiscal_year=2026")
      const result = await response.json()

      if (result.success) {
        setConflicts(result.data.conflicts)
        setTimeline(result.data.timeline)
        setSummary(result.data.summary)
        setLastUpdated(new Date().toISOString())
      }
    } catch (error) {
      console.error("Error fetching conflict data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function syncData() {
    try {
      setSyncing(true)
      await fetch("/api/usaspending/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fiscalYear: 2026 }),
      })
      await fetchConflictData()
    } catch (error) {
      console.error("Error syncing data:", error)
    } finally {
      setSyncing(false)
    }
  }

  const selectedConflictData = conflicts.find((c) => c.id === selectedConflict)

  const spendingByRegion = conflicts.reduce(
    (acc, conflict) => {
      const existing = acc.find((r) => r.region === conflict.region)
      if (existing) {
        existing.amount += conflict.total_spending
      } else {
        acc.push({
          region: conflict.region,
          amount: conflict.total_spending,
          color: REGION_COLORS[conflict.region] || "#6b7280",
        })
      }
      return acc
    },
    [] as { region: string; amount: number; color: string }[]
  )

  const aidTypeBreakdown = summary
    ? [
        { name: "Military Aid", value: summary.total_military_aid, fill: AID_TYPE_COLORS.military_aid },
        { name: "Economic Aid", value: summary.total_economic_aid, fill: AID_TYPE_COLORS.economic_aid },
        { name: "Humanitarian", value: summary.total_humanitarian_aid, fill: AID_TYPE_COLORS.humanitarian_aid },
        { name: "Operations", value: summary.total_operations_cost, fill: AID_TYPE_COLORS.operations_cost },
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading conflict data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Current Conflicts Tracker</h1>
          <p className="text-muted-foreground">
            Real-time tracking of U.S. military spending across active global operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(lastUpdated)}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={syncData} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Active Military Operations</AlertTitle>
        <AlertDescription>
          The United States is currently engaged in {summary?.active_conflicts || 0} active military operations across{" "}
          {summary?.regions_involved?.length || 0} regions. Total conflict-related spending for FY2026:{" "}
          {formatCurrency(summary?.total_conflict_spending || 0)}.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conflict Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.total_conflict_spending || 0)}</div>
            <p className="text-xs text-muted-foreground">FY2026 appropriations and supplementals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Military Aid</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(summary?.total_military_aid || 0)}</div>
            <p className="text-xs text-muted-foreground">Weapons, equipment, and training</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.active_conflicts || 0}</div>
            <p className="text-xs text-muted-foreground">Ongoing military engagements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions Involved</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.regions_involved?.length || 0}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {summary?.regions_involved?.slice(0, 3).map((region) => (
                <Badge key={region} variant="secondary" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conflicts">By Conflict</TabsTrigger>
          <TabsTrigger value="weapons">Weapons & Aid</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Spending by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Region</CardTitle>
                <CardDescription>Total conflict-related spending by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingByRegion} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => formatCurrency(value)}
                        className="text-xs"
                      />
                      <YAxis dataKey="region" type="category" width={100} className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                        {spendingByRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Aid Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Aid Type Breakdown</CardTitle>
                <CardDescription>Distribution of spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={aidTypeBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {aidTypeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {aidTypeBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conflict Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conflicts.map((conflict) => (
              <Card
                key={conflict.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => setSelectedConflict(conflict.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: REGION_COLORS[conflict.region],
                        color: REGION_COLORS[conflict.region],
                      }}
                    >
                      {conflict.region}
                    </Badge>
                    <Badge variant={conflict.status === "active" ? "destructive" : "secondary"}>
                      {conflict.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{conflict.conflict_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Spending</span>
                      <span className="font-semibold">{formatCurrency(conflict.total_spending)}</span>
                    </div>
                    <Progress
                      value={(conflict.total_spending / (summary?.total_conflict_spending || 1)) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground line-clamp-2">{conflict.description}</p>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* By Conflict Tab */}
        <TabsContent value="conflicts" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Conflict List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Active Operations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {conflicts.map((conflict) => (
                    <button
                      key={conflict.id}
                      className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                        selectedConflict === conflict.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConflict(conflict.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{conflict.conflict_name}</p>
                          <p className="text-sm text-muted-foreground">{conflict.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(conflict.total_spending)}</p>
                          <Badge variant="outline" className="text-xs">
                            {conflict.status}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conflict Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedConflictData?.conflict_name || "Select a conflict"}
                </CardTitle>
                {selectedConflictData && (
                  <CardDescription>{selectedConflictData.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedConflictData ? (
                  <div className="space-y-6">
                    {/* Spending Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Military Aid</p>
                        <p className="text-xl font-bold text-red-500">
                          {formatCurrency(selectedConflictData.military_aid)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Economic Aid</p>
                        <p className="text-xl font-bold text-blue-500">
                          {formatCurrency(selectedConflictData.economic_aid)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Humanitarian</p>
                        <p className="text-xl font-bold text-green-500">
                          {formatCurrency(selectedConflictData.humanitarian_aid)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Operations</p>
                        <p className="text-xl font-bold text-amber-500">
                          {formatCurrency(selectedConflictData.operations_cost)}
                        </p>
                      </div>
                    </div>

                    {/* Key Programs */}
                    <div>
                      <h4 className="font-semibold mb-2">Key Programs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedConflictData.key_programs.map((program) => (
                          <Badge key={program} variant="secondary">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Started: {formatDate(selectedConflictData.start_date)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    Select a conflict from the list to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weapons & Aid Tab */}
        <TabsContent value="weapons" className="space-y-4">
          {conflicts.map((conflict) => (
            <Card key={conflict.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{conflict.conflict_name}</CardTitle>
                    <CardDescription>Weapons and equipment provided</CardDescription>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: REGION_COLORS[conflict.region],
                      color: "white",
                    }}
                  >
                    {conflict.region}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {conflict.weapons_provided.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">System</th>
                          <th className="text-right py-2 font-medium">Quantity</th>
                          <th className="text-right py-2 font-medium">Value</th>
                          <th className="text-left py-2 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflict.weapons_provided.map((weapon, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2 font-medium">{weapon.name}</td>
                            <td className="py-2 text-right">
                              {weapon.quantity > 0 ? weapon.quantity.toLocaleString() : "-"}
                            </td>
                            <td className="py-2 text-right">{formatCurrency(weapon.value)}</td>
                            <td className="py-2 text-muted-foreground">{weapon.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Detailed weapons data not available for this operation.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Major developments and aid packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {timeline.map((event, index) => {
                    const conflict = conflicts.find((c) => c.id === event.conflict_id)
                    return (
                      <div key={index} className="relative pl-10">
                        <div
                          className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-background"
                          style={{
                            backgroundColor: conflict
                              ? REGION_COLORS[conflict.region]
                              : "#6b7280",
                          }}
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {event.event_type}
                              </Badge>
                              {conflict && (
                                <Badge variant="secondary" className="text-xs">
                                  {conflict.conflict_name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {event.amount > 0 ? formatCurrency(event.amount) : "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(event.event_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
