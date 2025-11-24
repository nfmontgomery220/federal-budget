-- Clean up existing database to reduce bloat

-- 1. DROP redundant policy_choices table
DROP TABLE IF EXISTS policy_choices CASCADE;

-- 2. Reduce user_interactions tracking (only keep essential actions)
-- Delete granular slider movements, keep only high-value events
DELETE FROM user_interactions 
WHERE action NOT IN ('session_started', 'session_completed', 'budget_saved', 'proposal_generated');

-- 3. Add retention policy: auto-delete interactions older than 90 days
CREATE OR REPLACE FUNCTION cleanup_old_interactions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_interactions 
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND action NOT IN ('session_completed', 'budget_saved');
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run manually or via cron)
COMMENT ON FUNCTION cleanup_old_interactions IS 'Run monthly to delete interactions older than 90 days';

-- 4. Update budget_configs to store only final state (not every slider move)
-- Already efficient - no changes needed

COMMENT ON SCHEMA public IS 'Optimized for 100K+ users with <500MB storage';
