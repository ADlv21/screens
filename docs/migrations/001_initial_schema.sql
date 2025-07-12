-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for mobile UI generator with simplified version control
-- Date: 2024-01-XX

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
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
CREATE TABLE projects (
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
CREATE TABLE screens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);

-- Screen Versions table (parent-child versioning)
CREATE TABLE screen_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id uuid REFERENCES screens(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    user_prompt text, -- what the user asked for
    ai_prompt text, -- what was sent to AI
    html_file_path text NOT NULL, -- path in Supabase Storage (includes inline Tailwind)
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES users(id),
    parent_version_id uuid REFERENCES screen_versions(id), -- for version tree
    is_current boolean DEFAULT false, -- latest version
    generation_time_ms integer -- how long AI took to generate
);

-- Subscriptions table (for payment tracking)
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    plan_type text NOT NULL CHECK (plan_type IN ('standard', 'pro')),
    billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    amount_paid decimal(10,2) NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    dodo_payment_id text, -- reference to Dodo Payments
    created_at timestamp with time zone DEFAULT now()
);

-- Credit usage tracking table
CREATE TABLE credit_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    usage_month text NOT NULL, -- 'YYYY-MM' format for easy querying
    credits_used integer DEFAULT 0,
    credits_granted integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, usage_month)
);

-- Performance indexes
CREATE INDEX idx_screens_project_id ON screens(project_id);
CREATE INDEX idx_screen_versions_screen_id ON screen_versions(screen_id);
CREATE INDEX idx_screen_versions_is_current ON screen_versions(is_current);
CREATE INDEX idx_screen_versions_parent_id ON screen_versions(parent_version_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_credit_usage_user_month ON credit_usage(user_id, usage_month);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Screens policies
CREATE POLICY "Users can view own screens" ON screens
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own screens" ON screens
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own screens" ON screens
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own screens" ON screens
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = screens.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Screen Versions policies
CREATE POLICY "Users can view own screen versions" ON screen_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screens 
            JOIN projects ON projects.id = screens.project_id
            WHERE screens.id = screen_versions.screen_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own screen versions" ON screen_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screens 
            JOIN projects ON projects.id = screens.project_id
            WHERE screens.id = screen_versions.screen_id 
            AND projects.user_id = auth.uid()
        )
    );

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
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Credit Usage policies
CREATE POLICY "Users can view own credit usage" ON credit_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit usage" ON credit_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit usage" ON credit_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Database triggers for automatic updates

-- Update updated_at timestamp on users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON screens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_usage_updated_at BEFORE UPDATE ON credit_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set version number
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

CREATE TRIGGER set_screen_version_number BEFORE INSERT ON screen_versions
    FOR EACH ROW EXECUTE FUNCTION set_version_number();

-- Function to ensure only one current version per screen
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

CREATE TRIGGER ensure_single_current_screen_version BEFORE INSERT OR UPDATE ON screen_versions
    FOR EACH ROW EXECUTE FUNCTION ensure_single_current_version();

-- Function to create initial credit usage record for new users
CREATE OR REPLACE FUNCTION create_initial_credit_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO credit_usage (user_id, usage_month, credits_used, credits_granted)
    VALUES (NEW.id, to_char(now(), 'YYYY-MM'), 0, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_initial_credit_usage_trigger AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_initial_credit_usage();

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with subscription information';
COMMENT ON TABLE projects IS 'User projects containing multiple screens';
COMMENT ON TABLE screens IS 'Individual UI screens within projects';
COMMENT ON TABLE screen_versions IS 'Version history for each screen with parent-child relationships';
COMMENT ON TABLE subscriptions IS 'Payment and billing history for user subscriptions';
COMMENT ON TABLE credit_usage IS 'Monthly usage tracking for credits';

COMMENT ON COLUMN screen_versions.user_prompt IS 'What the user asked for in their prompt';
COMMENT ON COLUMN screen_versions.ai_prompt IS 'What was actually sent to the AI (for debugging)';
COMMENT ON COLUMN screen_versions.html_file_path IS 'Path to HTML file in Supabase Storage with inline Tailwind';
COMMENT ON COLUMN screen_versions.parent_version_id IS 'Reference to previous version for version tree';
COMMENT ON COLUMN screen_versions.is_current IS 'Whether this is the active/latest version';
COMMENT ON COLUMN screen_versions.generation_time_ms IS 'How long the AI took to generate this version';

COMMENT ON COLUMN credit_usage.usage_month IS 'Month in YYYY-MM format for easy querying';
COMMENT ON COLUMN credit_usage.credits_used IS 'Number of credits used this month';
COMMENT ON COLUMN credit_usage.credits_granted IS 'Number of credits granted this month'; 