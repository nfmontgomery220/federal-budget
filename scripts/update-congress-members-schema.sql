-- Drop the old congress_members table and recreate with the correct schema
DROP TABLE IF EXISTS congress_members CASCADE;

-- Create the new schema with correct column names
CREATE TABLE congress_members (
  -- Official Library of Congress ID (permanent, never changes)
  bioguide_id TEXT PRIMARY KEY,
  
  -- Geographic data
  state TEXT NOT NULL,
  district TEXT, -- '01' for House, NULL for Senate
  chamber TEXT NOT NULL CHECK (chamber IN ('house', 'senate')),
  
  -- Party affiliation (can change)
  party TEXT CHECK (party IN ('D', 'R', 'I', 'Independent')),
  
  -- STABLE office contact info (rarely changes between elections)
  office_email TEXT NOT NULL,
  office_phone TEXT,
  dc_office_address TEXT,
  
  -- VOLATILE member info (changes per election)
  current_name TEXT NOT NULL,
  term_start DATE,
  term_end DATE,
  
  -- API metadata
  congress_gov_url TEXT,
  last_updated TIMESTAMP DEFAULT NOW(),
  data_source TEXT DEFAULT 'congress.gov'
);

-- Indexes for fast lookups
CREATE INDEX idx_state_district ON congress_members(state, district);
CREATE INDEX idx_chamber ON congress_members(chamber);
CREATE INDEX idx_current_name ON congress_members(current_name);

-- Enable RLS
ALTER TABLE congress_members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public reads on congress_members"
  ON congress_members FOR SELECT
  TO public
  USING (true);

-- Service role write access
CREATE POLICY "Allow service role writes on congress_members"
  ON congress_members FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE congress_members IS 'Our own database of congress members - primary source of truth for representative lookups';
