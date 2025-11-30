import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const zip = searchParams.get("zip")
    const state = searchParams.get("state")
    const district = searchParams.get("district")

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all clusters with member counts
    const { data: clusters, error: clusterError } = await supabase
      .from("budget_clusters")
      .select("*")
      .order("member_count", { ascending: false })

    if (clusterError) {
      return NextResponse.json({ error: "Failed to fetch clusters" }, { status: 500 })
    }

    // Get district-specific data if location provided
    let districtData = null
    if (state) {
      const { data: districtStats } = await supabase
        .from("district_consensus")
        .select(`
          *,
          budget_clusters (*)
        `)
        .eq("state", state)
        .eq("district", district || "")
        .order("support_percentage", { ascending: false })

      districtData = districtStats
    }

    // Calculate total users
    const totalUsers = clusters?.reduce((sum, c) => sum + (c.member_count || 0), 0) || 0

    // Get top policy preferences across all users
    const { data: topPolicies } = await supabase.from("budget_configs").select("category, value").limit(1000)

    // Aggregate policy preferences
    const policyAggregates: Record<string, { sum: number; count: number }> = {}
    topPolicies?.forEach((p) => {
      if (!policyAggregates[p.category]) {
        policyAggregates[p.category] = { sum: 0, count: 0 }
      }
      policyAggregates[p.category].sum += Number(p.value)
      policyAggregates[p.category].count += 1
    })

    const popularPolicies = Object.entries(policyAggregates)
      .map(([category, data]) => ({
        category,
        avgValue: data.sum / data.count,
        support: ((data.count / totalUsers) * 100).toFixed(1),
      }))
      .sort((a, b) => Number(b.support) - Number(a.support))
      .slice(0, 5)

    return NextResponse.json({
      clusters: clusters?.map((c) => ({
        ...c,
        percentage: totalUsers > 0 ? ((c.member_count / totalUsers) * 100).toFixed(1) : "0",
      })),
      districtData,
      popularPolicies,
      totalUsers,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Consensus data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch consensus data" }, { status: 500 })
  }
}
