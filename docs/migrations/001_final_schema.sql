-- Migration: 001_final_schema.sql
-- Description: Complete schema, triggers, storage, and policies for AI Screens
-- Date: 2024-XX-XX

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    name text,
    created_at timestamp with time zone DEFAULT now(),
    subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'standard', 'pro')),
    subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
    subscription_end_date timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

-- =====================
-- PROJECTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    prompt text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_archived boolean DEFAULT false
);

-- =====================
-- SCREENS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS screens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);

-- =====================
-- SCREEN VERSIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS screen_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id uuid REFERENCES screens(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    user_prompt text,
    ai_prompt text,
    html_file_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES users(id),
    parent_version_id uuid REFERENCES screen_versions(id),
    is_current boolean DEFAULT false,
    generation_time_ms integer
);

-- =====================
-- SUBSCRIPTIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    plan_type text NOT NULL CHECK (plan_type IN ('standard', 'pro')),
    billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    amount_paid decimal(10,2) NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    dodo_payment_id text,
    created_at timestamp with time zone DEFAULT now()
);

-- =====================
-- CREDIT USAGE TABLE
-- =====================
CREATE TABLE IF NOT EXISTS credit_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    usage_month text NOT NULL,
    credits_used integer DEFAULT 0,
    credits_granted integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, usage_month)
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_screens_project_id ON screens(project_id);
CREATE INDEX IF NOT EXISTS idx_screen_versions_screen_id ON screen_versions(screen_id);
CREATE INDEX IF NOT EXISTS idx_screen_versions_is_current ON screen_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_screen_versions_parent_id ON screen_versions(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_month ON credit_usage(user_id, usage_month);

-- =====================
-- RLS POLICIES
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Screens policies
DROP POLICY IF EXISTS "Users can view own screens" ON screens;
CREATE POLICY "Users can view own screens" ON screens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can insert own screens" ON screens;
CREATE POLICY "Users can insert own screens" ON screens
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can update own screens" ON screens;
CREATE POLICY "Users can update own screens" ON screens
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can delete own screens" ON screens;
CREATE POLICY "Users can delete own screens" ON screens
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Screen Versions policies
DROP POLICY IF EXISTS "Users can view own screen versions" ON screen_versions;
CREATE POLICY "Users can view own screen versions" ON screen_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screens 
            JOIN projects ON projects.id = screens.project_id
            WHERE screens.id = screen_versions.screen_id 
            AND projects.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can insert own screen versions" ON screen_versions;
CREATE POLICY "Users can insert own screen versions" ON screen_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screens 
            JOIN projects ON projects.id = screens.project_id
            WHERE screens.id = screen_versions.screen_id 
            AND projects.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Users can update own screen versions" ON screen_versions;
CREATE POLICY "Users can update own screen versions" ON screen_versions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM screens 
            JOIN projects ON projects.id = screens.project_id
            WHERE screens.id = screen_versions.screen_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Credit Usage policies
DROP POLICY IF EXISTS "Users can view own credit usage" ON credit_usage;
CREATE POLICY "Users can view own credit usage" ON credit_usage
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own credit usage" ON credit_usage;
CREATE POLICY "Users can insert own credit usage" ON credit_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own credit usage" ON credit_usage;
CREATE POLICY "Users can update own credit usage" ON credit_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================
-- TRIGGERS & FUNCTIONS
-- =====================
-- 1. Define all functions first

-- Update updated_at timestamp on users, projects, screens, credit_usage
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Set version number for screen_versions
CREATE OR REPLACE FUNCTION set_version_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.version_number IS NULL THEN
        SELECT COALESCE(MAX(version_number), 0) + 1
        INTO NEW.version_number
        FROM screen_versions
        WHERE screen_id = NEW.screen_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure only one current version per screen
CREATE OR REPLACE FUNCTION ensure_single_current_version()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current THEN
        UPDATE screen_versions
        SET is_current = false
        WHERE screen_id = NEW.screen_id AND id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Now create the triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_screens_updated_at ON screens;
CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON screens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_credit_usage_updated_at ON credit_usage;
CREATE TRIGGER update_credit_usage_updated_at BEFORE UPDATE ON credit_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_screen_version_number ON screen_versions;
CREATE TRIGGER set_screen_version_number BEFORE INSERT ON screen_versions
    FOR EACH ROW EXECUTE FUNCTION set_version_number();

DROP TRIGGER IF EXISTS ensure_single_current_screen_version ON screen_versions;
CREATE TRIGGER ensure_single_current_screen_version BEFORE INSERT OR UPDATE ON screen_versions
    FOR EACH ROW EXECUTE FUNCTION ensure_single_current_version();

-- =====================
-- CREDIT USAGE UTILITY FUNCTIONS
-- =====================
-- Get user's current credit usage for the current month
CREATE OR REPLACE FUNCTION get_user_current_credits(user_uuid uuid)
RETURNS TABLE(
    credits_used integer,
    credits_granted integer,
    credits_left integer,
    subscription_plan text
) AS $$
DECLARE
    plan_credits integer;
BEGIN
    SELECT CASE 
        WHEN u.subscription_plan = 'free' THEN 1
        WHEN u.subscription_plan = 'standard' THEN 200
        WHEN u.subscription_plan = 'pro' THEN 500
        ELSE 1
    END INTO plan_credits
    FROM users u WHERE u.id = user_uuid;

    RETURN QUERY
    SELECT 
        COALESCE(cu.credits_used, 0) as credits_used,
        COALESCE(cu.credits_granted, plan_credits) as credits_granted,
        GREATEST(COALESCE(cu.credits_granted, plan_credits) - COALESCE(cu.credits_used, 0), 0) as credits_left,
        u.subscription_plan
    FROM users u
    LEFT JOIN credit_usage cu ON u.id = cu.user_id 
        AND cu.usage_month = to_char(now(), 'YYYY-MM')
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has enough credits
CREATE OR REPLACE FUNCTION can_user_use_credits(user_uuid uuid, credits_needed integer)
RETURNS boolean AS $$
DECLARE
    usage_record record;
BEGIN
    SELECT * INTO usage_record FROM get_user_current_credits(user_uuid);
    RETURN usage_record.credits_left >= credits_needed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment user's credit usage
CREATE OR REPLACE FUNCTION increment_user_credits_used(user_uuid uuid, credits integer)
RETURNS void AS $$
BEGIN
    INSERT INTO credit_usage (user_id, usage_month, credits_used, credits_granted)
    VALUES (user_uuid, to_char(now(), 'YYYY-MM'), credits, NULL)
    ON CONFLICT (user_id, usage_month)
    DO UPDATE SET 
        credits_used = credit_usage.credits_used + credits,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset monthly credit usage (for cron job)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
    UPDATE credit_usage 
    SET 
        credits_used = 0,
        credits_granted = NULL,
        updated_at = now()
    WHERE usage_month < to_char(now(), 'YYYY-MM');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- AUTH USER TRIGGER FOR USERS TABLE
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, now())
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================
-- STORAGE BUCKETS & POLICIES
-- =====================
-- HTML files bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'html-files',
    'html-files',
    true,
    5242880, -- 5MB limit
    ARRAY['text/html', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Project assets bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-assets',
    'project-assets',
    true,
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for html-files bucket
DROP POLICY IF EXISTS "Users can upload their own HTML files" ON storage.objects;
CREATE POLICY "Users can upload their own HTML files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can view their own HTML files" ON storage.objects;
CREATE POLICY "Users can view their own HTML files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can update their own HTML files" ON storage.objects;
CREATE POLICY "Users can update their own HTML files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can delete their own HTML files" ON storage.objects;
CREATE POLICY "Users can delete their own HTML files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for project-assets bucket
DROP POLICY IF EXISTS "Users can upload their own project assets" ON storage.objects;
CREATE POLICY "Users can upload their own project assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can view their own project assets" ON storage.objects;
CREATE POLICY "Users can view their own project assets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can update their own project assets" ON storage.objects;
CREATE POLICY "Users can update their own project assets" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
DROP POLICY IF EXISTS "Users can delete their own project assets" ON storage.objects;
CREATE POLICY "Users can delete their own project assets" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================
-- END OF FINAL MIGRATION
-- ===================== 