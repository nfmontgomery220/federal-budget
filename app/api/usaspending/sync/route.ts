import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// USAspending.gov API endpoints
const USASPENDING_BASE = "https://api.usaspending.gov/api/v2"

// Department of Defense CGAC code
const DOD_AGENCY_CODE = "097"

interface USAspendingAgencyResponse {
  fiscal_year: number
  agency_budgetary_resources: number
  total_budgetary_resources: number
  agency_total_obligated: number
  agency_obligation_by_period: Array<{
    period: number
    obligated: number
  }>
}

interface USAspendingAwardResponse {
  results: Array<{
    Award ID: string
    Recipient Name: string
    Award Amount: number
    Description: string
    "Awarding Agency": string
    "Awarding Sub Agency": string
    "Contract Award Type"?: string
  }>
  page_metadata: {
    total: number
    page: number
    hasNext: boolean
  }
}

async function fetchDefenseBudgetaryResources(fiscalYear: number): Promise<USAspendingAgencyResponse | null> {
  try {
    const response = await fetch(
      `${USASPENDING_BASE}/agency/${DOD_AGENCY_CODE}/budgetary_resources/?fiscal_year=${fiscalYear}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error(`[v0] USAspending API error: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching defense budgetary resources:", error)
    return null
  }
}

async function fetchDefenseAwards(fiscalYear: number, limit = 100): Promise<USAspendingAwardResponse | null> {
  try {
    const response = await fetch(`${USASPENDING_BASE}/search/spending_by_award/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: {
          time_period: [
            {
              start_date: `${fiscalYear - 1}-10-01`,
              end_date: `${fiscalYear}-09-30`,
            },
          ],
          agencies: [
            {
              type: "awarding",
              tier: "toptier",
              name: "Department of Defense",
            },
          ],
        },
        fields: [
          "Award ID",
          "Recipient Name",
          "Award Amount",
          "Description",
          "Awarding Agency",
          "Awarding Sub Agency",
          "Contract Award Type",
        ],
        page: 1,
        limit: limit,
        sort: "Award Amount",
        order: "desc",
      }),
    })

    if (!response.ok) {
      console.error(`[v0] USAspending awards API error: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching defense awards:", error)
    return null
  }
}

async function fetchSpendingByCategory(fiscalYear: number, category: string) {
  try {
    const response = await fetch(`${USASPENDING_BASE}/search/spending_by_category/${category}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: {
          time_period: [
            {
              start_date: `${fiscalYear - 1}-10-01`,
              end_date: `${fiscalYear}-09-30`,
            },
          ],
          agencies: [
            {
              type: "awarding",
              tier: "toptier",
              name: "Department of Defense",
            },
          ],
        },
        limit: 50,
      }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`[v0] Error fetching spending by ${category}:`, error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { fiscalYear = 2026 } = await request.json()
    const supabase = await createClient()

    // Check if we already have recent data (within last 24 hours)
    const { data: existingData } = await supabase
      .from("usaspending_defense_data")
      .select("*")
      .eq("fiscal_year", fiscalYear)
      .gte("last_updated", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single()

    if (existingData) {
      return NextResponse.json({
        success: true,
        message: "Data is already up to date",
        data: existingData,
        cached: true,
      })
    }

    // Fetch fresh data from USAspending.gov
    const [budgetaryResources, topAwards, spendingByRecipient] = await Promise.all([
      fetchDefenseBudgetaryResources(fiscalYear),
      fetchDefenseAwards(fiscalYear, 50),
      fetchSpendingByCategory(fiscalYear, "recipient"),
    ])

    if (!budgetaryResources) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch budgetary resources" },
        { status: 500 }
      )
    }

    // Prepare data for storage
    const dataToStore = {
      fiscal_year: fiscalYear,
      total_budgetary_resources: budgetaryResources.total_budgetary_resources || 0,
      total_obligations: budgetaryResources.agency_total_obligated || 0,
      obligations_by_period: budgetaryResources.agency_obligation_by_period || [],
      top_awards: topAwards?.results?.slice(0, 20) || [],
      spending_by_recipient: spendingByRecipient?.results?.slice(0, 20) || [],
      last_updated: new Date().toISOString(),
    }

    // Upsert the data
    const { data, error } = await supabase
      .from("usaspending_defense_data")
      .upsert(dataToStore, { onConflict: "fiscal_year" })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase upsert error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to store data" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Data synced successfully",
      data,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Sync error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to sync USAspending data",
    endpoints: {
      sync: "POST /api/usaspending/sync",
      defense: "GET /api/usaspending/defense",
      conflicts: "GET /api/conflicts",
    },
  })
}
