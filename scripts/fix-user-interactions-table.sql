-- Fix the user_interactions table structure
ALTER TABLE user_interactions 
DROP COLUMN IF EXISTS details,
ADD COLUMN IF NOT EXISTS value TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update existing records to have proper structure
UPDATE user_interactions SET metadata = '{}' WHERE metadata IS NULL;

-- Ensure all required columns exist with correct types
ALTER TABLE user_interactions 
ALTER COLUMN action_type SET NOT NULL,
ALTER COLUMN timestamp SET DEFAULT NOW();
