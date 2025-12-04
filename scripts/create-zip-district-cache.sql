CREATE TABLE IF NOT EXISTS zip_district_cache (
  zip_code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  congressional_district TEXT NOT NULL, -- "IL-07", "CA-12", etc.
  
  -- Cache metadata
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cached_at TIMESTAMP DEFAULT NOW(),
  
  -- Track data source
  source TEXT DEFAULT 'cicero_api'
);

-- Renamed index to avoid conflict with congress_members table
CREATE INDEX idx_zip_cache_state_district ON zip_district_cache(state, congressional_district);

-- Enable RLS
ALTER TABLE zip_district_cache ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public reads on zip_district_cache"
  ON zip_district_cache FOR SELECT
  TO public
  USING (true);

-- Service role write access
CREATE POLICY "Allow service role writes on zip_district_cache"
  ON zip_district_cache FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE zip_district_cache IS 'ZIP code to congressional district cache - built organically from Cicero API lookups';
