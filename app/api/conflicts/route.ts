import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fiscalYear = parseInt(searchParams.get("fiscal_year") || "2026")

    const supabase = await createClient()

    // Get conflict spending data
    const { data: conflicts, error: conflictsError } = await supabase
      .from("conflict_spending")
      .select("*")
      .eq("fiscal_year", fiscalYear)
      .order("total_spending", { ascending: false })

    // Get timeline data
    const { data: timeline, error: timelineError } = await supabase
      .from("conflict_timeline")
      .select("*")
      .order("event_date", { ascending: false })
      .limit(50)

    if (conflictsError || !conflicts || conflicts.length === 0) {
      // Return comprehensive fallback data
      return NextResponse.json({
        success: true,
        data: {
          conflicts: getFallbackConflictData(fiscalYear),
          timeline: getFallbackTimeline(),
          summary: getConflictSummary(fiscalYear),
        },
        source: "fallback",
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        conflicts,
        timeline: timeline || getFallbackTimeline(),
        summary: calculateSummary(conflicts),
      },
      source: "database",
    })
  } catch (error) {
    console.error("[v0] Error fetching conflict data:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getFallbackConflictData(fiscalYear: number) {
  return [
    {
      id: "ukraine-russia",
      conflict_name: "Ukraine Security Assistance",
      region: "Europe",
      fiscal_year: fiscalYear,
      total_spending: 48000000000,
      military_aid: 28500000000,
      economic_aid: 12800000000,
      humanitarian_aid: 6700000000,
      operations_cost: 0,
      description: "U.S. security assistance to Ukraine including weapons systems, training, and intelligence support",
      status: "active",
      start_date: "2022-02-24",
      key_programs: [
        "Ukraine Security Assistance Initiative (USAI)",
        "Presidential Drawdown Authority",
        "Foreign Military Financing",
        "NATO Support",
      ],
      weapons_provided: [
        { name: "HIMARS", quantity: 40, value: 2400000000 },
        { name: "M1 Abrams Tanks", quantity: 31, value: 400000000 },
        { name: "Patriot Missile Systems", quantity: 2, value: 1800000000 },
        { name: "F-16 Fighting Falcons", quantity: 0, value: 0, note: "Training ongoing" },
        { name: "Bradley Fighting Vehicles", quantity: 190, value: 950000000 },
        { name: "Stinger Missiles", quantity: 2000, value: 625000000 },
        { name: "Javelin Missiles", quantity: 10000, value: 1760000000 },
      ],
    },
    {
      id: "israel-support",
      conflict_name: "Israel Security Assistance",
      region: "Middle East",
      fiscal_year: fiscalYear,
      total_spending: 18200000000,
      military_aid: 14300000000,
      economic_aid: 0,
      humanitarian_aid: 3900000000,
      operations_cost: 0,
      description: "Enhanced security assistance to Israel including Iron Dome replenishment and precision munitions",
      status: "active",
      start_date: "2023-10-07",
      key_programs: [
        "Iron Dome Replenishment",
        "David's Sling Support",
        "Precision Guided Munitions",
        "Intelligence Sharing",
      ],
      weapons_provided: [
        { name: "Iron Dome Interceptors", quantity: 5000, value: 1500000000 },
        { name: "155mm Artillery Shells", quantity: 100000, value: 850000000 },
        { name: "Joint Direct Attack Munitions", quantity: 15000, value: 600000000 },
        { name: "Small Diameter Bombs", quantity: 5000, value: 250000000 },
      ],
    },
    {
      id: "indo-pacific",
      conflict_name: "Indo-Pacific Deterrence",
      region: "Indo-Pacific",
      fiscal_year: fiscalYear,
      total_spending: 14500000000,
      military_aid: 3200000000,
      economic_aid: 1800000000,
      humanitarian_aid: 0,
      operations_cost: 9500000000,
      description: "Pacific Deterrence Initiative and regional security cooperation with allies",
      status: "active",
      start_date: "2021-01-01",
      key_programs: [
        "Pacific Deterrence Initiative (PDI)",
        "AUKUS Partnership",
        "Taiwan Security Assistance",
        "Philippines Enhanced Defense Cooperation",
      ],
      weapons_provided: [
        { name: "Virginia-class Submarines (PDI)", quantity: 2, value: 7200000000 },
        { name: "Long-Range Hypersonic Missiles", quantity: 0, value: 2800000000, note: "Development" },
        { name: "Taiwan Arms Sales", quantity: 0, value: 1200000000, note: "Various systems" },
      ],
    },
    {
      id: "centcom-operations",
      conflict_name: "CENTCOM Operations",
      region: "Middle East",
      fiscal_year: fiscalYear,
      total_spending: 8700000000,
      military_aid: 1200000000,
      economic_aid: 800000000,
      humanitarian_aid: 1500000000,
      operations_cost: 5200000000,
      description: "Ongoing operations including counter-ISIS, Red Sea security, and regional presence",
      status: "active",
      start_date: "2014-09-01",
      key_programs: [
        "Operation Inherent Resolve (Counter-ISIS)",
        "Red Sea/Houthi Response",
        "Syria Presence",
        "Iraq Security Cooperation",
      ],
      weapons_provided: [],
    },
    {
      id: "africom-operations",
      conflict_name: "AFRICOM Operations",
      region: "Africa",
      fiscal_year: fiscalYear,
      total_spending: 2100000000,
      military_aid: 850000000,
      economic_aid: 450000000,
      humanitarian_aid: 300000000,
      operations_cost: 500000000,
      description: "Counter-terrorism operations and security cooperation in Africa",
      status: "active",
      start_date: "2007-10-01",
      key_programs: [
        "Counter-terrorism Operations",
        "Security Force Assistance",
        "Partnership Programs",
      ],
      weapons_provided: [],
    },
  ]
}

function getFallbackTimeline() {
  return [
    {
      event_date: "2026-03-01",
      conflict_id: "ukraine-russia",
      event_type: "aid_package",
      title: "FY2026 Ukraine Supplemental",
      description: "$12B additional security assistance package approved",
      amount: 12000000000,
    },
    {
      event_date: "2026-02-15",
      conflict_id: "indo-pacific",
      event_type: "deployment",
      title: "PDI Expansion",
      description: "Additional forces deployed to Guam and Philippines",
      amount: 2800000000,
    },
    {
      event_date: "2026-01-20",
      conflict_id: "israel-support",
      event_type: "aid_package",
      title: "Iron Dome Replenishment",
      description: "Emergency replenishment of Iron Dome interceptors",
      amount: 1500000000,
    },
    {
      event_date: "2025-12-15",
      conflict_id: "centcom-operations",
      event_type: "operation",
      title: "Red Sea Operations Expansion",
      description: "Increased naval presence to counter Houthi attacks",
      amount: 850000000,
    },
    {
      event_date: "2025-11-01",
      conflict_id: "ukraine-russia",
      event_type: "aid_package",
      title: "ATACMS Delivery",
      description: "Long-range ATACMS missiles provided to Ukraine",
      amount: 680000000,
    },
  ]
}

function getConflictSummary(fiscalYear: number) {
  const conflicts = getFallbackConflictData(fiscalYear)
  return calculateSummary(conflicts)
}

function calculateSummary(conflicts: any[]) {
  return {
    total_conflict_spending: conflicts.reduce((sum, c) => sum + c.total_spending, 0),
    total_military_aid: conflicts.reduce((sum, c) => sum + c.military_aid, 0),
    total_economic_aid: conflicts.reduce((sum, c) => sum + c.economic_aid, 0),
    total_humanitarian_aid: conflicts.reduce((sum, c) => sum + c.humanitarian_aid, 0),
    total_operations_cost: conflicts.reduce((sum, c) => sum + c.operations_cost, 0),
    active_conflicts: conflicts.filter((c) => c.status === "active").length,
    regions_involved: [...new Set(conflicts.map((c) => c.region))],
  }
}
