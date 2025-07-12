-- Migration: 004_credit_system_migration.sql
-- Description: Migrate from creations/edits per month to credit-based usage tracking
-- Date: 2024-XX-XX

-- 1. Remove old columns from credit_usage
ALTER TABLE credit_usage
  DROP COLUMN IF EXISTS monthly_creations_used,
  DROP COLUMN IF EXISTS monthly_edits_used;

-- 2. Add new columns for credit-based tracking
ALTER TABLE credit_usage
  ADD COLUMN IF NOT EXISTS credits_used integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_granted integer DEFAULT 0;

-- 3. Update comments
COMMENT ON TABLE credit_usage IS 'Monthly usage tracking for credits';
COMMENT ON COLUMN credit_usage.usage_month IS 'Month in YYYY-MM format for easy querying';
COMMENT ON COLUMN credit_usage.credits_used IS 'Number of credits used this month';
COMMENT ON COLUMN credit_usage.credits_granted IS 'Number of credits granted this month';

-- 4. Replace utility functions with credit-based versions

-- Function to get user's current credit usage for the current month
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

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION can_user_use_credits(user_uuid uuid, credits_needed integer)
RETURNS boolean AS $$
DECLARE
    usage_record record;
BEGIN
    SELECT * INTO usage_record FROM get_user_current_credits(user_uuid);
    RETURN usage_record.credits_left >= credits_needed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user's credit usage
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

-- Function to reset monthly credit usage (can be called by a cron job)
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