# Database Setup Instructions

## Step 1: Run the Main Creation Script

In your Supabase SQL Editor, run the `create-budget-tables-v3-corrected.sql` script:

1. Log into your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire `create-budget-tables-v3-corrected.sql` file
4. Click "Run" to execute

This will:
- Drop any existing tables (clean slate)
- Create all four tables with correct schemas
- Set up foreign key relationships
- Create performance indexes
- Enable Row Level Security (RLS)
- Create permissive RLS policies for anonymous access
- Grant necessary permissions

## Step 2: Verify the Setup

After running the creation script, run `verify-tables.sql` to confirm everything is set up correctly:

1. Copy and paste the `verify-tables.sql` file into SQL Editor
2. Click "Run"
3. Review the results to ensure:
   - All 4 tables exist
   - Columns have correct data types
   - Foreign keys are properly set up
   - RLS policies are active
   - Indexes are created

## Expected Tables

1. **budget_sessions** - Main session tracking
   - id (UUID, PK)
   - created_at (timestamp)
   - completed (boolean)
   - scenario_name (text, nullable)
   - final_balance (numeric)
   - total_spending (numeric)
   - total_revenue (numeric)

2. **budget_configs** - Budget configuration choices
   - id (UUID, PK)
   - session_id (UUID, FK → budget_sessions)
   - category (text)
   - value (numeric)
   - created_at (timestamp)

3. **user_feedback** - User surveys and feedback
   - id (UUID, PK)
   - session_id (UUID, FK → budget_sessions)
   - political_affiliation (text, nullable)
   - income_bracket (text, nullable)
   - difficulty_rating (integer 1-5, nullable)
   - comments (text, nullable)
   - would_support_plan (boolean, nullable)
   - created_at (timestamp)

4. **user_interactions** - Action tracking
   - id (UUID, PK)
   - session_id (UUID, FK → budget_sessions)
   - action (text)
   - details (jsonb, nullable)
   - created_at (timestamp)

## Troubleshooting

If you encounter errors:

1. **"relation already exists"** - The old tables weren't dropped. Run:
   \`\`\`sql
   DROP TABLE IF EXISTS user_interactions CASCADE;
   DROP TABLE IF EXISTS user_feedback CASCADE;
   DROP TABLE IF EXISTS budget_configs CASCADE;
   DROP TABLE IF EXISTS budget_sessions CASCADE;
   \`\`\`
   Then re-run the creation script.

2. **"permission denied"** - Ensure you're using the service role key in your backend code (`supabase-admin.ts`), not the anon key.

3. **RLS blocking inserts** - The policies are permissive (allow all). If you're still blocked, temporarily disable RLS:
   \`\`\`sql
   ALTER TABLE budget_sessions DISABLE ROW LEVEL SECURITY;
   \`\`\`
   (But remember to re-enable it for production!)

## Testing the Setup

Test with a simple insert:

\`\`\`sql
-- Insert a test session
INSERT INTO budget_sessions (completed, scenario_name)
VALUES (false, 'Test Scenario')
RETURNING *;

-- Verify it was created
SELECT * FROM budget_sessions ORDER BY created_at DESC LIMIT 1;
\`\`\`

If this works, your database is ready to use!
