-- Create budget_sessions table
CREATE TABLE IF NOT EXISTS budget_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  scenario_name TEXT,
  final_balance DECIMAL,
  total_spending DECIMAL,
  total_revenue DECIMAL
);

-- Create budget_configs table
CREATE TABLE IF NOT EXISTS budget_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES budget_sessions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  value DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES budget_sessions(id) ON DELETE CASCADE,
  political_affiliation TEXT,
  income_bracket TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  comments TEXT,
  would_support_plan BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interactions table with correct column names
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES budget_sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target TEXT,
  value TEXT,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE budget_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - adjust as needed)
CREATE POLICY "Allow all operations on budget_sessions" ON budget_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on budget_configs" ON budget_configs FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_feedback" ON user_feedback FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_interactions" ON user_interactions FOR ALL USING (true);
