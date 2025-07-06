-- Create budget_sessions table
CREATE TABLE IF NOT EXISTS budget_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- Create budget_configurations table
CREATE TABLE IF NOT EXISTS budget_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES budget_sessions(id),
  fiscal_year INTEGER NOT NULL,
  scenario_name TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  final_balance NUMERIC NOT NULL,
  achieved_balance BOOLEAN NOT NULL,
  total_spending_cuts NUMERIC NOT NULL,
  total_revenue_increases NUMERIC NOT NULL,
  spending_cuts JSONB NOT NULL,
  revenue_increases JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create policy_choices table
CREATE TABLE IF NOT EXISTS policy_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_id UUID REFERENCES budget_configurations(id),
  category TEXT NOT NULL,
  policy_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES budget_sessions(id),
  political_affiliation TEXT,
  income_bracket TEXT,
  difficulty_rating INTEGER,
  comments TEXT,
  would_support_plan BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES budget_sessions(id),
  action_type TEXT NOT NULL,
  target TEXT NOT NULL,
  value TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_budget_configurations_session_id ON budget_configurations(session_id);
CREATE INDEX IF NOT EXISTS idx_policy_choices_config_id ON policy_choices(config_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
