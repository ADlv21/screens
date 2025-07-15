-- =====================
-- AI SCREENS - COMPLETE POLAR CREDITS MIGRATION
-- =====================
-- Single migration file for Pure Polar Credits approach
-- Combines: Base schema + RLS policies + Polar integration
-- Date: 2024-12-XX

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- CORE TABLES
-- =====================

-- Users table (simplified - no credit tracking)
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

-- Projects table
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

-- Screens table
CREATE TABLE IF NOT EXISTS screens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);

-- Screen versions table
CREATE TABLE IF NOT EXISTS screen_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id uuid REFERENCES screens(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    user_prompt text NOT NULL,
    ai_prompt text,
    html_file_path text NOT NULL,
    created_by uuid REFERENCES users(id),
    created_at timestamp with time zone DEFAULT now(),
    is_current boolean DEFAULT false,
    parent_version_id uuid REFERENCES screen_versions(id)
);

-- Subscriptions table (with Polar integration)
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    plan_name text NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    -- Polar-specific fields
    polar_subscription_id text UNIQUE,
    polar_customer_id text
);

-- Polar configuration table
CREATE TABLE IF NOT EXISTS polar_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_name text NOT NULL,
    meter_id text,
    credits_per_subscription jsonb DEFAULT '{"standard": 200, "pro": 500}',
    credit_cost_per_generation integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_screens_project_id ON screens(project_id);
CREATE INDEX IF NOT EXISTS idx_screen_versions_screen_id ON screen_versions(screen_id);
CREATE INDEX IF NOT EXISTS idx_screen_versions_is_current ON screen_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_screen_versions_parent_id ON screen_versions(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_customer_id ON subscriptions(polar_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_subscription_id ON subscriptions(polar_subscription_id);

-- =====================
-- ROW LEVEL SECURITY POLICIES
-- =====================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE polar_config ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR ALL USING (id = auth.uid());

-- Project policies
CREATE POLICY "Allow user insert project" ON projects
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow user select project" ON projects
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow user update project" ON projects
    FOR UPDATE USING (user_id = auth.uid());

-- Screen policies
CREATE POLICY "Allow user insert screen" ON screens
    FOR INSERT WITH CHECK (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Allow user select screen" ON screens
    FOR SELECT USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Allow user update screen" ON screens
    FOR UPDATE USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

-- Screen version policies
CREATE POLICY "Allow user insert screen version" ON screen_versions
    FOR INSERT WITH CHECK (
        screen_id IN (
            SELECT s.id FROM screens s
            JOIN projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow user select screen version" ON screen_versions
    FOR SELECT USING (
        screen_id IN (
            SELECT s.id FROM screens s
            JOIN projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Polar config (read-only for authenticated users)
CREATE POLICY "Authenticated users can read polar config" ON polar_config
    FOR SELECT TO authenticated USING (true);

-- =====================
-- STORAGE SETUP
-- =====================

-- Create storage bucket for HTML files
INSERT INTO storage.buckets (id, name, public)
VALUES ('html-files', 'html-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own HTML files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can view their own HTML files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can update their own HTML files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can delete their own HTML files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

-- =====================
-- UTILITY FUNCTIONS
-- =====================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Set version number automatically
CREATE OR REPLACE FUNCTION set_version_number()
RETURNS TRIGGER AS $$
DECLARE
    max_version integer;
BEGIN
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO max_version
    FROM screen_versions
    WHERE screen_id = NEW.screen_id;
    
    NEW.version_number = max_version;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure only one current version per screen
CREATE OR REPLACE FUNCTION ensure_single_current_version()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE screen_versions 
        SET is_current = false 
        WHERE screen_id = NEW.screen_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email));
    RETURN new;
END;
$$;

-- =====================
-- TRIGGERS
-- =====================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screens_updated_at
    BEFORE UPDATE ON screens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polar_config_updated_at
    BEFORE UPDATE ON polar_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Screen version triggers
CREATE TRIGGER set_screen_version_number
    BEFORE INSERT ON screen_versions
    FOR EACH ROW
    EXECUTE FUNCTION set_version_number();

CREATE TRIGGER ensure_single_current_screen_version
    BEFORE INSERT OR UPDATE ON screen_versions
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_current_version();

-- User creation trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_new_user();

-- =====================
-- INITIAL DATA
-- =====================

-- Insert default Polar configuration
INSERT INTO polar_config (meter_name, credits_per_subscription, credit_cost_per_generation)
VALUES ('screen_generation_meter', '{"standard": 200, "pro": 500}', 1)
ON CONFLICT DO NOTHING;

-- =====================
-- SUCCESS MESSAGE
-- =====================
DO $$
BEGIN
    RAISE NOTICE '🚀 AI Screens database setup complete with Pure Polar Credits!';
    RAISE NOTICE '✅ Tables created: users, projects, screens, screen_versions, subscriptions, polar_config';
    RAISE NOTICE '✅ RLS policies enabled for security';
    RAISE NOTICE '✅ Storage bucket configured for HTML files';
    RAISE NOTICE '✅ Triggers and functions installed';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '   1. Set up Polar.sh account and products';
    RAISE NOTICE '   2. Install @polar-sh/nextjs SDK';
    RAISE NOTICE '   3. Configure environment variables';
    RAISE NOTICE '   4. Update your app to use Polar Customer State API';
END $$; 