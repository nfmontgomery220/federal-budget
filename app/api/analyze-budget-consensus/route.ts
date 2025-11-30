import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from("budget_sessions")
      .select("*")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Get budget config for this session
    const { data: configs, error: configError } = await supabase
      .from("budget_configs")
      .select("category, value")
      .eq("session_id", sessionId)

    if (configError) {
      return NextResponse.json({ error: "Failed to fetch budget configs" }, { status: 500 })
    }

    // Analyze spending approach
    const defenseCategories = ["defense", "military", "army", "navy", "air_force"]
    const entitlementCategories = ["social_security", "medicare", "medicaid"]

    const defenseSpending =
      configs
        ?.filter((c) => defenseCategories.some((cat) => c.category?.toLowerCase().includes(cat)))
        .reduce((sum, c) => sum + Number(c.value), 0) || 0

    const entitlementSpending =
      configs
        ?.filter((c) => entitlementCategories.some((cat) => c.category?.toLowerCase().includes(cat)))
        .reduce((sum, c) => sum + Number(c.value), 0) || 0

    // Determine approaches
    const defenseApproach = defenseSpending < 750 ? "cut" : defenseSpending > 850 ? "increase" : "maintain"
    const entitlementApproach =
      entitlementSpending < 2000 ? "cut" : entitlementSpending > 2500 ? "increase" : "maintain"
    const taxApproach =
      (session.total_revenue || 0) > 5000 ? "increase" : (session.total_revenue || 0) < 4000 ? "cut" : "maintain"

    // Find matching cluster
    const { data: clusters } = await supabase
      .from("budget_clusters")
      .select("*")
      .eq("defense_approach", defenseApproach)
      .eq("entitlement_approach", entitlementApproach)
      .eq("tax_approach", taxApproach)

    let matchedCluster = clusters?.[0]
    let matchScore = 100

    // If no exact match, find closest
    if (!matchedCluster) {
      const { data: allClusters } = await supabase.from("budget_clusters").select("*")

      // Calculate similarity scores
      let bestMatch = allClusters?.[0]
      let bestScore = 0

      for (const cluster of allClusters || []) {
        let score = 0
        if (cluster.defense_approach === defenseApproach) score += 33
        if (cluster.entitlement_approach === entitlementApproach) score += 33
        if (cluster.tax_approach === taxApproach) score += 34

        if (score > bestScore) {
          bestScore = score
          bestMatch = cluster
        }
      }

      matchedCluster = bestMatch
      matchScore = bestScore
    }

    if (!matchedCluster) {
      return NextResponse.json({ error: "No matching cluster found" }, { status: 404 })
    }

    // Save cluster assignment
    await supabase.from("session_clusters").upsert({
      session_id: sessionId,
      cluster_id: matchedCluster.id,
      match_score: matchScore,
    })

    // Update cluster member count
    const { data: clusterMembers } = await supabase
      .from("session_clusters")
      .select("id")
      .eq("cluster_id", matchedCluster.id)

    await supabase
      .from("budget_clusters")
      .update({
        member_count: clusterMembers?.length || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchedCluster.id)

    return NextResponse.json({
      cluster: matchedCluster,
      matchScore,
      approaches: {
        defense: defenseApproach,
        entitlement: entitlementApproach,
        tax: taxApproach,
      },
    })
  } catch (error) {
    console.error("[v0] Budget consensus analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
