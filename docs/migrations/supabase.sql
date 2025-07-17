-- =====================
-- AI SCREENS - MINIMAL SETUP (NO TRIGGERS OR FUNCTIONS)
-- =====================
-- Single migration file: Only tables, storage, indexes, and RLS policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- CORE TABLES
-- =====================

-- Users table (synced with auth.users)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
-- STORAGE SETUP
-- =====================

-- Create storage bucket for HTML files
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
    'html-files',
    'html-files',
    false,
    false,
    5242880, -- 5MB limit
    ARRAY['text/html', 'text/plain', 'text/css', 'application/javascript']
)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screens_project_id ON screens(project_id);
CREATE INDEX IF NOT EXISTS idx_screens_order_index ON screens(order_index);
CREATE INDEX IF NOT EXISTS idx_screen_versions_screen_id ON screen_versions(screen_id);
CREATE INDEX IF NOT EXISTS idx_screen_versions_is_current ON screen_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_screen_versions_created_at ON screen_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screen_versions_parent_id ON screen_versions(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_customer_id ON subscriptions(polar_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_subscription_id ON subscriptions(polar_subscription_id);

-- =====================
-- ROW LEVEL SECURITY POLICIES
-- =====================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE polar_config ENABLE ROW LEVEL SECURITY;

-- Users policies - users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR ALL USING (id = auth.uid());

-- Project policies
CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (user_id = auth.uid());

-- Screen policies
CREATE POLICY "Users can insert screens for own projects" ON screens
    FOR INSERT WITH CHECK (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can view screens for own projects" ON screens
    FOR SELECT USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update screens for own projects" ON screens
    FOR UPDATE USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can delete screens for own projects" ON screens
    FOR DELETE USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );

-- Screen version policies
CREATE POLICY "Users can insert screen versions for own projects" ON screen_versions
    FOR INSERT WITH CHECK (
        screen_id IN (
            SELECT s.id FROM screens s
            JOIN projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view screen versions for own projects" ON screen_versions
    FOR SELECT USING (
        screen_id IN (
            SELECT s.id FROM screens s
            JOIN projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update screen versions for own projects" ON screen_versions
    FOR UPDATE USING (
        screen_id IN (
            SELECT s.id FROM screens s
            JOIN projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (user_id = auth.uid());

-- Polar config (read-only for authenticated users)
CREATE POLICY "Authenticated users can read polar config" ON polar_config
    FOR SELECT TO authenticated USING (true);

-- =====================
-- STORAGE POLICIES
-- =====================

-- Storage policies for HTML files
CREATE POLICY "Users can upload HTML files for own projects"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can view HTML files for own projects"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can update HTML files for own projects"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
);

CREATE POLICY "Users can delete HTML files for own projects"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'html-files' AND
    (storage.foldername(name))[1] = 'projects' AND
    (SELECT user_id FROM projects WHERE id::text = (storage.foldername(name))[2]) = auth.uid()
); 

-- =====================
-- USER SYNC FUNCTION & TRIGGER
-- =====================

-- Function to sync new auth.users to users table
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

-- Trigger to sync users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_new_user(); 