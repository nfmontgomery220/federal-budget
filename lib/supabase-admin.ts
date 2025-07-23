import { createClient } from "@supabase/supabase-js"

/**
 * Admin (Service-Role) Supabase client.
 * NOTE:  Never import this file in Client Components!
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})
