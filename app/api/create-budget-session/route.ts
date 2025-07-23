import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

/**
 * POST /api/create-budget-session
 * Body: { }
 * Returns: { id: string }
 */
export async function POST() {
  // Insert an empty row – default values populate created_at & id
  const { data, error } = await supabaseAdmin.from("budget_sessions").insert({}).select("id").single()

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
