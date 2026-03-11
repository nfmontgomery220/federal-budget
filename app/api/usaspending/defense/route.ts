import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fiscalYear = parseInt(searchParams.get("fiscal_year") || "2026")

    const supabase = await createClient()

    // Get cached defense spending data
    const { data, error } = await supabase
      .from("usaspending_defense_data")
      .select("*")
      .eq("fiscal_year", fiscalYear)
      .single()

    if (error || !data) {
      // Return fallback data if no cached data exists
      return NextResponse.json({
        success: true,
        data: getFallbackDefenseData(fiscalYear),
        source: "fallback",
      })
    }

    // Check if data is stale (older than 24 hours)
    const lastUpdated = new Date(data.last_updated)
    const isStale = Date.now() - lastUpdated.getTime() > 24 * 60 * 60 * 1000

    return NextResponse.json({
      success: true,
      data,
      source: "cache",
      isStale,
      lastUpdated: data.last_updated,
    })
  } catch (error) {
    console.error("[v0] Error fetching defense data:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getFallbackDefenseData(fiscalYear: number) {
  // FY2026 baseline data from CBO and DoD budget documents
  const baseData: Record<number, {
    total_budgetary_resources: number
    total_obligations: number
    discretionary: number
    reconciliation_mandatory: number
  }> = {
    2025: {
      total_budgetary_resources: 886000000000,
      total_obligations: 842000000000,
      discretionary: 849800000000,
      reconciliation_mandatory: 0,
    },
    2026: {
      total_budgetary_resources: 995000000000,
      total_obligations: 920000000000,
      discretionary: 838700000000,
      reconciliation_mandatory: 156200000000,
    },
  }

  const yearData = baseData[fiscalYear] || baseData[2026]

  return {
    fiscal_year: fiscalYear,
    total_budgetary_resources: yearData.total_budgetary_resources,
    total_obligations: yearData.total_obligations,
    obligations_by_period: [],
    top_awards: [],
    spending_by_recipient: [],
    last_updated: new Date().toISOString(),
    // Additional breakdown
    breakdown: {
      discretionary: yearData.discretionary,
      reconciliation_mandatory: yearData.reconciliation_mandatory,
      military_personnel: 178400000000,
      operation_maintenance: 296800000000,
      procurement: 167500000000,
      rdt_e: 127800000000,
      military_construction: 14200000000,
      family_housing: 1800000000,
      revolving_funds: 1600000000,
    },
  }
}
