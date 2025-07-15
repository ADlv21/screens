-- =====================
-- SUPABASE RESOURCES CLEANUP
-- =====================
-- This script removes ALL resources created by the migration files
-- Run this to start fresh with a clean database

-- =====================
-- DROP TRIGGERS
-- =====================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_screens_updated_at ON screens;
DROP TRIGGER IF EXISTS update_credit_usage_updated_at ON credit_usage;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_polar_config_updated_at ON polar_config;
DROP TRIGGER IF EXISTS set_screen_version_number ON screen_versions;
DROP TRIGGER IF EXISTS ensure_single_current_screen_version ON screen_versions;

-- =====================
-- DROP FUNCTIONS
-- =====================
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS set_version_number();
DROP FUNCTION IF EXISTS ensure_single_current_version();
DROP FUNCTION IF EXISTS get_user_current_credits(uuid);
DROP FUNCTION IF EXISTS can_user_use_credits(uuid, integer);
DROP FUNCTION IF EXISTS increment_user_credits_used(uuid, integer);
DROP FUNCTION IF EXISTS reset_monthly_credits();
DROP FUNCTION IF EXISTS grant_credits_to_user(uuid, integer);
DROP FUNCTION IF EXISTS handle_polar_subscription_event(jsonb);

-- =====================
-- DROP RLS POLICIES
-- =====================
DROP POLICY IF EXISTS "Allow user insert project" ON projects;
DROP POLICY IF EXISTS "Allow user select project" ON projects;
DROP POLICY IF EXISTS "Allow user insert screen" ON screens;
DROP POLICY IF EXISTS "Allow user select screen" ON screens;
DROP POLICY IF EXISTS "Allow user insert screen version" ON screen_versions;
DROP POLICY IF EXISTS "Allow user select screen version" ON screen_versions;
DROP POLICY IF EXISTS "Users can view own credit usage" ON credit_usage;
DROP POLICY IF EXISTS "Users can insert own credit usage" ON credit_usage;
DROP POLICY IF EXISTS "Users can update own credit usage" ON credit_usage;

-- =====================
-- DROP STORAGE POLICIES
-- =====================
DROP POLICY IF EXISTS "Users can upload their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own HTML files" ON storage.objects;

-- =====================
-- DROP STORAGE BUCKET AND OBJECTS
-- =====================

-- First, delete all objects in the bucket
DELETE FROM storage.objects WHERE bucket_id = 'html-files';

-- Then delete the bucket itself
DELETE FROM storage.buckets WHERE id = 'html-files';

-- =====================
-- DROP TABLES (in reverse dependency order)
-- =====================
DROP TABLE IF EXISTS credit_usage_archive;
DROP TABLE IF EXISTS polar_config;
DROP TABLE IF EXISTS polar_webhook_events;
DROP TABLE IF EXISTS credit_usage;
DROP TABLE IF EXISTS screen_versions;
DROP TABLE IF EXISTS screens;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS users;

-- =====================
-- REVOKE PERMISSIONS
-- =====================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- =====================
-- CLEAN UP EXTENSIONS (optional)
-- =====================
-- Uncomment if you want to remove the UUID extension entirely
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- =====================
-- SUCCESS MESSAGE
-- =====================
DO $$
BEGIN
    RAISE NOTICE 'All AI Screens database resources have been cleaned up successfully!';
    RAISE NOTICE 'You can now run the consolidated migration file.';
END $$; 