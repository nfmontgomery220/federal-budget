-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on budget_sessions" ON budget_sessions;
DROP POLICY IF EXISTS "Allow all operations on budget_configs" ON budget_configs;
DROP POLICY IF EXISTS "Allow all operations on user_feedback" ON user_feedback;
DROP POLICY IF EXISTS "Allow all operations on user_interactions" ON user_interactions;

-- Update user_interactions table structure
ALTER TABLE user_interactions 
DROP COLUMN IF EXISTS action,
ADD COLUMN IF NOT EXISTS action_type TEXT,
ADD COLUMN IF NOT EXISTS target TEXT,
ADD COLUMN IF NOT EXISTS value TEXT,
DROP COLUMN IF EXISTS created_at,
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make action_type NOT NULL if it exists
UPDATE user_interactions SET action_type = 'unknown' WHERE action_type IS NULL;
ALTER TABLE user_interactions ALTER COLUMN action_type SET NOT NULL;

-- Recreate policies
CREATE POLICY "Allow all operations on budget_sessions" ON budget_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on budget_configs" ON budget_configs FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_feedback" ON user_feedback FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_interactions" ON user_interactions FOR ALL USING (true);
