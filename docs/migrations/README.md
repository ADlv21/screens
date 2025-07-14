# Database Migrations

This directory contains the SQL migration scripts for setting up the AI Screens database with Pure Polar Credits.

## Migration Files

### 000_polar_credits_complete.sql ⭐ **SINGLE MIGRATION**
**Complete database setup for Pure Polar Credits approach**
- Creates all essential tables: users, projects, screens, screen_versions, subscriptions, polar_config
- **No credit_usage table** - Polar handles all credit tracking
- Sets up Row Level Security (RLS) policies for data protection
- Creates all necessary triggers and utility functions
- Adds performance indexes
- Configures Supabase Storage for HTML files
- Includes auth.users trigger for user creation
- **Single source of truth** for credits via Polar.sh

### cleanup_all_resources.sql
**Complete cleanup script**
- Removes ALL database resources if you need to start fresh
- Drops tables, functions, triggers, policies, and storage
- Run this first if you need to reset your database

## **Simplified Architecture**

### ✅ What's Included
- **Core tables**: users, projects, screens, screen_versions
- **Polar integration**: subscriptions table with polar_subscription_id
- **Configuration**: polar_config table for Polar settings
- **Security**: Complete RLS policies
- **Storage**: HTML file storage with policies
- **Automation**: Triggers for versioning and timestamps

### ❌ What's Removed (Polar handles these)
- ~~credit_usage table~~
- ~~get_user_current_credits() function~~
- ~~can_user_use_credits() function~~
- ~~increment_user_credits_used() function~~
- ~~Complex credit tracking logic~~

## **Pure Polar Credits Benefits**
- 🎯 **Single source of truth** for credits
- 🚀 **Automatic credit granting** when subscriptions renew
- 💳 **Built-in billing** (taxes, proration, overages)
- 📊 **Rich analytics** via Polar dashboard
- 🧹 **90% less database complexity**
- 🌍 **Global tax compliance**

## How to Run the Migrations

### Option 1: Fresh Setup (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste `000_polar_credits_complete.sql`
4. Execute the migration

**That's it!** ✨ Your database is ready with Pure Polar Credits.

### Option 2: Clean Existing Database

If you have existing data that needs to be cleared:

1. **First**: Run `cleanup_all_resources.sql` to remove all existing resources
2. **Second**: Run `000_polar_credits_complete.sql` to set up the new schema

### What Gets Created

```sql
-- Tables
✅ users (simplified, no credit columns)
✅ projects 
✅ screens
✅ screen_versions
✅ subscriptions (with polar_subscription_id)
✅ polar_config (Polar settings)

-- Security
✅ Row Level Security policies
✅ Storage policies for HTML files

-- Automation  
✅ Triggers for timestamps and versioning
✅ Functions for screen version management
✅ Auth user creation trigger
```

## Verification

After running the migrations, you can verify the setup:

### Check Tables
```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check new Polar integration
\d polar_webhook_events
\d subscriptions  -- Should now have polar_* columns
```

### Check Functions
```sql
-- List utility functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name LIKE '%polar%';
```

### Test Polar Integration Functions
```sql
-- Test Polar webhook functions (replace with actual IDs)
SELECT handle_polar_payment_success(
    'user-uuid-here'::uuid, 
    'standard', 
    'polar_sub_123', 
    'polar_cust_456'
);
```

## Important Notes

### Polar.sh Integration
- **Merchant of Record**: Polar handles all tax compliance globally
- **Lower Setup Complexity**: Minimal database changes required
- **Credit System**: Existing credit system works perfectly with Polar
- **Webhook Idempotency**: Built-in duplicate event protection

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies are automatically enforced
- Polar webhook events are service-role only

### Storage Structure
- HTML files are stored in the `html-files` bucket
- File paths follow the pattern: `projects/{project_id}/screens/{screen_id}/v{version}/index.html`
- Files are automatically secured by user ownership

### Usage Tracking
- Usage is tracked monthly (YYYY-MM format)
- Counters automatically reset each month
- Utility functions handle usage increment and limit checking
- **Credits automatically granted** via Polar webhooks

### Version Control
- Each screen can have multiple versions
- Only one version can be current at a time
- Version numbers are automatically assigned
- Parent-child relationships are maintained

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you're running migrations as a database owner
2. **RLS Policies**: Verify that RLS policies are correctly set up
3. **Storage Buckets**: Ensure storage buckets are created before uploading files
4. **Triggers/Functions**: Check that all functions are defined before triggers that use them
5. **Polar Integration**: Verify environment variables are set correctly

### Migration Order Issues

If you run migrations out of order:

```sql
-- Check if migration was already applied
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'polar_subscription_id'
);
```

### Reset Database (Development Only)

If you need to reset the database during development:

```sql
-- Drop all tables (WARNING: This will delete all data)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run all migrations in order: 001, 002, 003
```

## Next Steps

After running the migrations:

1. Set up your environment variables for Polar.sh
2. Configure Polar.sh products in their dashboard
3. Set up webhook endpoints in your Next.js app
4. Implement Polar.sh checkout integration
5. Test the complete payment flow

## Environment Variables Needed

```env
# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers (existing)
OPENAI_API_KEY=

# Polar.sh (new)
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
NEXT_PUBLIC_POLAR_ENVIRONMENT=sandbox # or production
```

## Support

If you encounter any issues with the migration:
1. Check the Supabase documentation
2. Review Polar.sh documentation
3. Verify your database connection
4. Review the error messages carefully
5. Ensure you have the necessary permissions

# Migration Notes

## 2024-XX-XX: Polar.sh Integration
- Added Polar.sh payment integration
- Updated subscriptions table with Polar-specific fields
- Added webhook event tracking for idempotency
- Enhanced credit granting system
- Maintained backward compatibility with existing credit system
- All existing functions continue to work unchanged

## 2024-XX-XX: Unified Final Schema
- All schema, triggers, functions, storage, and policies are now in a single migration file.
- Credit-based usage tracking is the default.
- All legacy columns and triggers have been removed. 