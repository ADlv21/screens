-- Migration: 003_utility_functions.sql
-- Description: Utility functions for common database operations
-- Date: 2024-01-XX

-- Function to get user's current usage for the current month
CREATE OR REPLACE FUNCTION get_user_current_usage(user_uuid uuid)
RETURNS TABLE(
    monthly_creations_used integer,
    monthly_edits_used integer,
    subscription_plan text,
    creation_limit integer,
    edit_limit integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(cu.monthly_creations_used, 0) as monthly_creations_used,
        COALESCE(cu.monthly_edits_used, 0) as monthly_edits_used,
        u.subscription_plan,
        CASE 
            WHEN u.subscription_plan = 'free' THEN 1
            WHEN u.subscription_plan = 'standard' THEN 10
            WHEN u.subscription_plan = 'pro' THEN 20
            ELSE 1
        END as creation_limit,
        CASE 
            WHEN u.subscription_plan = 'free' THEN 0
            WHEN u.subscription_plan = 'standard' THEN 20
            WHEN u.subscription_plan = 'pro' THEN 40
            ELSE 0
        END as edit_limit
    FROM users u
    LEFT JOIN credit_usage cu ON u.id = cu.user_id 
        AND cu.usage_month = to_char(now(), 'YYYY-MM')
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create a new screen
CREATE OR REPLACE FUNCTION can_user_create_screen(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
    usage_record record;
BEGIN
    SELECT * INTO usage_record FROM get_user_current_usage(user_uuid);
    
    RETURN usage_record.monthly_creations_used < usage_record.creation_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can edit a screen
CREATE OR REPLACE FUNCTION can_user_edit_screen(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
    usage_record record;
BEGIN
    SELECT * INTO usage_record FROM get_user_current_usage(user_uuid);
    
    RETURN usage_record.monthly_edits_used < usage_record.edit_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user's creation usage
CREATE OR REPLACE FUNCTION increment_user_creation_usage(user_uuid uuid)
RETURNS void AS $$
BEGIN
    INSERT INTO credit_usage (user_id, usage_month, monthly_creations_used, monthly_edits_used)
    VALUES (user_uuid, to_char(now(), 'YYYY-MM'), 1, 0)
    ON CONFLICT (user_id, usage_month)
    DO UPDATE SET 
        monthly_creations_used = credit_usage.monthly_creations_used + 1,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user's edit usage
CREATE OR REPLACE FUNCTION increment_user_edit_usage(user_uuid uuid)
RETURNS void AS $$
BEGIN
    INSERT INTO credit_usage (user_id, usage_month, monthly_creations_used, monthly_edits_used)
    VALUES (user_uuid, to_char(now(), 'YYYY-MM'), 0, 1)
    ON CONFLICT (user_id, usage_month)
    DO UPDATE SET 
        monthly_edits_used = credit_usage.monthly_edits_used + 1,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get screen version tree
CREATE OR REPLACE FUNCTION get_screen_version_tree(screen_uuid uuid)
RETURNS TABLE(
    id uuid,
    version_number integer,
    user_prompt text,
    created_at timestamp with time zone,
    parent_version_id uuid,
    is_current boolean,
    generation_time_ms integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sv.id,
        sv.version_number,
        sv.user_prompt,
        sv.created_at,
        sv.parent_version_id,
        sv.is_current,
        sv.generation_time_ms
    FROM screen_versions sv
    WHERE sv.screen_id = screen_uuid
    ORDER BY sv.version_number ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get project with screen count
CREATE OR REPLACE FUNCTION get_user_projects_with_screen_count(user_uuid uuid)
RETURNS TABLE(
    id uuid,
    name text,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    screen_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.created_at,
        p.updated_at,
        COUNT(s.id) as screen_count
    FROM projects p
    LEFT JOIN screens s ON p.id = s.project_id AND s.is_active = true
    WHERE p.user_id = user_uuid AND p.is_archived = false
    GROUP BY p.id, p.name, p.description, p.created_at, p.updated_at
    ORDER BY p.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage (can be called by a cron job)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    -- This function can be called monthly to reset usage counters
    -- In practice, you might want to archive old usage data instead
    UPDATE credit_usage 
    SET 
        monthly_creations_used = 0,
        monthly_edits_used = 0,
        updated_at = now()
    WHERE usage_month < to_char(now(), 'YYYY-MM');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid uuid)
RETURNS TABLE(
    subscription_plan text,
    subscription_status text,
    subscription_end_date timestamp with time zone,
    is_active boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.subscription_plan,
        u.subscription_status,
        u.subscription_end_date,
        CASE 
            WHEN u.subscription_status = 'active' AND 
                 (u.subscription_end_date IS NULL OR u.subscription_end_date > now())
            THEN true
            ELSE false
        END as is_active
    FROM users u
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 