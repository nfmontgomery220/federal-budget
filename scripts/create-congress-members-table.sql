-- Congress Members Database: Our own source of truth
-- Storage: ~150KB for all 575 members
-- Last updated: Initial schema creation

CREATE TABLE IF NOT EXISTS congress_members (
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
  data_source TEXT DEFAULT 'congress.gov' -- 'congress.gov' or 'manual'
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_state_district ON congress_members(state, district);
CREATE INDEX IF NOT EXISTS idx_chamber ON congress_members(chamber);
CREATE INDEX IF NOT EXISTS idx_current_name ON congress_members(current_name);

-- View for easy House member lookup
CREATE OR REPLACE VIEW house_members AS
SELECT * FROM congress_members WHERE chamber = 'house' ORDER BY state, district;

-- View for easy Senate member lookup
CREATE OR REPLACE VIEW senate_members AS
SELECT * FROM congress_members WHERE chamber = 'senate' ORDER BY state, current_name;

COMMENT ON TABLE congress_members IS 'Our own database of congress members - primary source of truth for representative lookups. Populated via Congress.gov API and manually verified.';
COMMENT ON COLUMN congress_members.bioguide_id IS 'Library of Congress Biographical Directory ID - permanent identifier';
COMMENT ON COLUMN congress_members.office_email IS 'Stable office email - use this for contact, not personal emails';
COMMENT ON COLUMN congress_members.current_name IS 'Current member name - update after elections';
