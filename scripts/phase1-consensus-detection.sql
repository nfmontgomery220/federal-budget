-- Phase 1: Consensus Detection & Coalition Building
-- Creates tables and functions for identifying budget approach clusters

-- Table 1: Budget Clusters (Approach Categories)
CREATE TABLE IF NOT EXISTS budget_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name TEXT NOT NULL,
  description TEXT,
  avg_spending_total NUMERIC(12, 2),
  avg_revenue_total NUMERIC(12, 2),
  avg_deficit NUMERIC(12, 2),
  defense_approach TEXT, -- 'cut', 'maintain', 'increase'
  entitlement_approach TEXT, -- 'cut', 'maintain', 'increase'
  tax_approach TEXT, -- 'cut', 'maintain', 'increase'
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Session to Cluster Mapping
CREATE TABLE IF NOT EXISTS session_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES budget_sessions(id) ON DELETE CASCADE,
  cluster_id UUID REFERENCES budget_clusters(id) ON DELETE CASCADE,
  match_score NUMERIC(5, 2), -- 0-100% similarity to cluster
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, cluster_id)
);

-- Table 3: District Consensus Stats
CREATE TABLE IF NOT EXISTS district_consensus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  district TEXT, -- NULL for Senate
  cluster_id UUID REFERENCES budget_clusters(id) ON DELETE CASCADE,
  support_percentage NUMERIC(5, 2), -- % of district in this cluster
  sample_size INTEGER,
  avg_deficit_proposed NUMERIC(12, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, district, cluster_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_clusters_session ON session_clusters(session_id);
CREATE INDEX IF NOT EXISTS idx_session_clusters_cluster ON session_clusters(cluster_id);
CREATE INDEX IF NOT EXISTS idx_district_consensus_location ON district_consensus(state, district);
CREATE INDEX IF NOT EXISTS idx_budget_clusters_member_count ON budget_clusters(member_count DESC);

-- RLS Policies
ALTER TABLE budget_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_consensus ENABLE ROW LEVEL SECURITY;

-- Public read access for all consensus data
CREATE POLICY "Allow public reads on budget_clusters"
  ON budget_clusters FOR SELECT
  USING (true);

CREATE POLICY "Allow public reads on session_clusters"
  ON session_clusters FOR SELECT
  USING (true);

CREATE POLICY "Allow public reads on district_consensus"
  ON district_consensus FOR SELECT
  USING (true);

-- Service role can write
CREATE POLICY "Allow service role writes on budget_clusters"
  ON budget_clusters FOR ALL
  USING (true);

CREATE POLICY "Allow service role writes on session_clusters"
  ON session_clusters FOR ALL
  USING (true);

CREATE POLICY "Allow service role writes on district_consensus"
  ON district_consensus FOR ALL
  USING (true);

-- Grant permissions
GRANT SELECT ON budget_clusters TO anon, authenticated;
GRANT SELECT ON session_clusters TO anon, authenticated;
GRANT SELECT ON district_consensus TO anon, authenticated;
GRANT ALL ON budget_clusters TO service_role;
GRANT ALL ON session_clusters TO service_role;
GRANT ALL ON district_consensus TO service_role;

-- Create predefined clusters
INSERT INTO budget_clusters (cluster_name, description, defense_approach, entitlement_approach, tax_approach)
VALUES 
  ('Progressive Reform', 'Significant defense cuts, maintained entitlements, increased progressive taxation', 'cut', 'maintain', 'increase'),
  ('Fiscal Hawk', 'Across-the-board spending cuts with minimal tax increases', 'cut', 'cut', 'maintain'),
  ('Defense Priority', 'Maintained or increased defense, cuts elsewhere, targeted tax increases', 'increase', 'cut', 'increase'),
  ('Balanced Moderate', 'Modest cuts across categories with broad-based revenue increases', 'maintain', 'cut', 'increase'),
  ('Entitlement Reformer', 'Defense cuts, significant entitlement reform, minimal tax changes', 'cut', 'cut', 'maintain'),
  ('Revenue Focused', 'Minimal spending cuts, major tax reforms and new revenue sources', 'maintain', 'maintain', 'increase')
ON CONFLICT DO NOTHING;
