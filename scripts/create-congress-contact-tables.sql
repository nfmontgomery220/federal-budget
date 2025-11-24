-- Lean schema for Contact Congress feature
-- Designed to minimize storage while maximizing insights

-- Representatives: Cache Congress member data (updated quarterly)
CREATE TABLE congress_members (
  id TEXT PRIMARY KEY, -- bioguide_id from Congress.gov
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT, -- null for Senators
  party TEXT NOT NULL,
  chamber TEXT NOT NULL, -- 'house' or 'senate'
  email TEXT,
  phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Contact Events: Track when users send proposals (lean storage)
CREATE TABLE congress_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES budget_sessions(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES congress_members(id),
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  zip_code TEXT NOT NULL, -- for geographic analysis (5 chars)
  method TEXT NOT NULL CHECK (method IN ('email', 'copied', 'downloaded')) -- how they contacted
);

-- Aggregate Stats: Pre-computed to avoid expensive queries
CREATE TABLE congress_contact_stats (
  member_id TEXT PRIMARY KEY REFERENCES congress_members(id),
  total_contacts INTEGER DEFAULT 0,
  last_contact TIMESTAMP WITH TIME ZONE,
  avg_deficit_proposed NUMERIC(12, 2), -- average of proposals sent
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_congress_contacts_member ON congress_contacts(member_id);
CREATE INDEX idx_congress_contacts_zip ON congress_contacts(zip_code);
CREATE INDEX idx_congress_contacts_date ON congress_contacts(contacted_at DESC);
CREATE INDEX idx_congress_members_state ON congress_members(state, district);

-- RLS Policies
ALTER TABLE congress_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE congress_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE congress_contact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public reads on congress_members" 
  ON congress_members FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts on congress_contacts" 
  ON congress_contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public reads on congress_contact_stats" 
  ON congress_contact_stats FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON congress_members TO anon, authenticated;
GRANT INSERT ON congress_contacts TO anon, authenticated;
GRANT SELECT ON congress_contact_stats TO anon, authenticated;

COMMENT ON TABLE congress_members IS 'Cached Congress member directory (updated quarterly)';
COMMENT ON TABLE congress_contacts IS 'Minimal tracking of user-to-Congress outreach';
COMMENT ON TABLE congress_contact_stats IS 'Pre-aggregated stats to avoid expensive queries';
