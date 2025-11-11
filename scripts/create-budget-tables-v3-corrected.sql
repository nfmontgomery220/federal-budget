-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS user_interactions CASCADE;
DROP TABLE IF EXISTS user_feedback CASCADE;
DROP TABLE IF EXISTS budget_configs CASCADE;
DROP TABLE IF EXISTS budget_sessions CASCADE;

-- Create budget_sessions table with correct schema matching TypeScript
CREATE TABLE budget_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  scenario_name TEXT,
  final_balance NUMERIC(12, 2),
  total_spending NUMERIC(12, 2),
  total_revenue NUMERIC(12, 2)
);

-- Create budget_configs table with proper foreign key
CREATE TABLE budget_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES budget_sessions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  value NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_feedback table with all required fields
CREATE TABLE user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES budget_sessions(id) ON DELETE CASCADE,
  political_affiliation TEXT,
  income_bracket TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  comments TEXT,
  would_support_plan BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_interactions table for tracking user actions
CREATE TABLE user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES budget_sessions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_budget_sessions_created_at ON budget_sessions(created_at DESC);
CREATE INDEX idx_budget_sessions_completed ON budget_sessions(completed);
CREATE INDEX idx_budget_configs_session_id ON budget_configs(session_id);
CREATE INDEX idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX idx_user_interactions_action ON user_interactions(action);

-- Enable Row Level Security (RLS)
ALTER TABLE budget_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access (adjust based on your security needs)
-- For budget_sessions
CREATE POLICY "Allow anonymous inserts on budget_sessions" 
  ON budget_sessions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous selects on budget_sessions" 
  ON budget_sessions FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous updates on budget_sessions" 
  ON budget_sessions FOR UPDATE 
  USING (true);

-- For budget_configs
CREATE POLICY "Allow anonymous inserts on budget_configs" 
  ON budget_configs FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous selects on budget_configs" 
  ON budget_configs FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous updates on budget_configs" 
  ON budget_configs FOR UPDATE 
  USING (true);

-- For user_feedback
CREATE POLICY "Allow anonymous inserts on user_feedback" 
  ON user_feedback FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous selects on user_feedback" 
  ON user_feedback FOR SELECT 
  USING (true);

-- For user_interactions
CREATE POLICY "Allow anonymous inserts on user_interactions" 
  ON user_interactions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous selects on user_interactions" 
  ON user_interactions FOR SELECT 
  USING (true);

-- Add helpful comments to tables
COMMENT ON TABLE budget_sessions IS 'Stores user budget exercise sessions';
COMMENT ON TABLE budget_configs IS 'Stores budget configuration choices made by users';
COMMENT ON TABLE user_feedback IS 'Stores user feedback and survey responses';
COMMENT ON TABLE user_interactions IS 'Tracks user interactions and actions during sessions';

-- Grant necessary permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON budget_sessions TO anon, authenticated;
GRANT ALL ON budget_configs TO anon, authenticated;
GRANT ALL ON user_feedback TO anon, authenticated;
GRANT ALL ON user_interactions TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
