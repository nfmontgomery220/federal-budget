-- Verification script to check if tables were created correctly
-- Run this after running the create script to verify everything is set up

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('budget_sessions', 'budget_configs', 'user_feedback', 'user_interactions')
ORDER BY table_name;

-- Check table structures
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('budget_sessions', 'budget_configs', 'user_feedback', 'user_interactions')
ORDER BY table_name, ordinal_position;

-- Check foreign key relationships
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('budget_configs', 'user_feedback', 'user_interactions');

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('budget_sessions', 'budget_configs', 'user_feedback', 'user_interactions')
ORDER BY tablename, policyname;

-- Check indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('budget_sessions', 'budget_configs', 'user_feedback', 'user_interactions')
ORDER BY tablename, indexname;
