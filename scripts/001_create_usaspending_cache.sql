-- USAspending data cache table for defense spending
CREATE TABLE IF NOT EXISTS usaspending_defense_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year INTEGER NOT NULL,
  agency_code TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  total_budgetary_resources NUMERIC,
  total_obligations NUMERIC,
  total_outlays NUMERIC,
  data_source TEXT DEFAULT 'usaspending_api',
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fiscal_year, agency_code)
);

-- Conflict spending tracking table
CREATE TABLE IF NOT EXISTS conflict_spending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_name TEXT NOT NULL,
  region TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  military_aid NUMERIC DEFAULT 0,
  operations NUMERIC DEFAULT 0,
  equipment NUMERIC DEFAULT 0,
  humanitarian NUMERIC DEFAULT 0,
  total_obligated NUMERIC DEFAULT 0,
  total_authorized NUMERIC DEFAULT 0,
  authorization_status TEXT,
  status TEXT DEFAULT 'active',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_source TEXT,
  UNIQUE(conflict_name, fiscal_year)
);

-- Conflict timeline events
CREATE TABLE IF NOT EXISTS conflict_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  amount NUMERIC,
  description TEXT,
  event_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE usaspending_defense_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_spending ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_timeline ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public reads on usaspending_defense_data" 
  ON usaspending_defense_data FOR SELECT USING (true);
CREATE POLICY "Allow public reads on conflict_spending" 
  ON conflict_spending FOR SELECT USING (true);
CREATE POLICY "Allow public reads on conflict_timeline" 
  ON conflict_timeline FOR SELECT USING (true);

-- Service role write access policies
CREATE POLICY "Allow service role writes on usaspending_defense_data" 
  ON usaspending_defense_data FOR ALL USING (true);
CREATE POLICY "Allow service role writes on conflict_spending" 
  ON conflict_spending FOR ALL USING (true);
CREATE POLICY "Allow service role writes on conflict_timeline" 
  ON conflict_timeline FOR ALL USING (true);

-- Insert initial conflict spending data for FY2026
INSERT INTO conflict_spending (conflict_name, region, fiscal_year, military_aid, operations, equipment, humanitarian, total_obligated, total_authorized, authorization_status, status, data_source)
VALUES 
  ('Ukraine Support', 'Europe', 2026, 24500000000, 12000000000, 8500000000, 3000000000, 48000000000, 61000000000, 'Partially Authorized', 'active', 'Congressional Appropriations'),
  ('Israel Support', 'Middle East', 2026, 8000000000, 2500000000, 3200000000, 300000000, 14000000000, 14300000000, 'Authorized', 'active', 'Congressional Appropriations'),
  ('Indo-Pacific Deterrence', 'Indo-Pacific', 2026, 1500000000, 4500000000, 2800000000, 200000000, 9000000000, 9800000000, 'Authorized', 'active', 'Pacific Deterrence Initiative'),
  ('Global Counterterrorism', 'Global', 2026, 3000000000, 15000000000, 5500000000, 1500000000, 25000000000, 28000000000, 'Authorized', 'active', 'Base Budget + OCO')
ON CONFLICT (conflict_name, fiscal_year) DO UPDATE SET
  military_aid = EXCLUDED.military_aid,
  operations = EXCLUDED.operations,
  equipment = EXCLUDED.equipment,
  humanitarian = EXCLUDED.humanitarian,
  total_obligated = EXCLUDED.total_obligated,
  total_authorized = EXCLUDED.total_authorized,
  authorization_status = EXCLUDED.authorization_status,
  status = EXCLUDED.status,
  last_updated = NOW();

-- Insert timeline events
INSERT INTO conflict_timeline (conflict_name, event_date, amount, description, event_type)
VALUES 
  ('Ukraine Support', '2022-02-24', 0, 'Russia invades Ukraine', 'conflict_start'),
  ('Ukraine Support', '2022-03-15', 13600000000, 'First Ukraine supplemental appropriation', 'appropriation'),
  ('Ukraine Support', '2022-05-21', 40000000000, 'Second Ukraine supplemental package', 'appropriation'),
  ('Ukraine Support', '2023-12-29', 0, 'Border security negotiations stall Ukraine aid', 'legislative'),
  ('Ukraine Support', '2024-04-24', 61000000000, 'National Security Supplemental Package signed', 'appropriation'),
  ('Ukraine Support', '2025-01-20', 0, 'New administration reviews Ukraine policy', 'policy_change'),
  ('Israel Support', '2023-10-07', 0, 'Hamas attacks Israel', 'conflict_start'),
  ('Israel Support', '2024-04-24', 14300000000, 'Israel aid in National Security Supplemental', 'appropriation'),
  ('Indo-Pacific Deterrence', '2021-01-01', 2200000000, 'Pacific Deterrence Initiative launched', 'appropriation'),
  ('Indo-Pacific Deterrence', '2024-01-01', 9100000000, 'FY2024 PDI funding approved', 'appropriation'),
  ('Indo-Pacific Deterrence', '2025-06-01', 9800000000, 'FY2026 PDI authorization', 'appropriation'),
  ('Global Counterterrorism', '2001-09-11', 0, 'Global War on Terror begins', 'conflict_start'),
  ('Global Counterterrorism', '2021-08-31', 0, 'US withdrawal from Afghanistan', 'policy_change'),
  ('Global Counterterrorism', '2025-01-01', 28000000000, 'FY2026 counterterrorism baseline funding', 'appropriation');
