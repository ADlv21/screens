# Database Migrations

This directory contains the SQL migration script for setting up the mobile UI generator database schema.

## Migration File

### 001_final_schema.sql
- Creates all database tables (users, projects, screens, screen_versions, subscriptions, credit_usage)
- Sets up Row Level Security (RLS) policies
- Creates all triggers and utility functions
- Adds performance indexes
- Sets up Supabase Storage buckets and policies
- Includes the auth.users trigger for user creation
- All logic is consolidated in a single file for easy setup/reset

## How to Run the Migration

### Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste the contents of `001_final_schema.sql`
4. Execute the script

## Verification

After running the migration, you can verify the setup:

### Check Tables
```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check table structure
\d users
\d projects
\d screens
\d screen_versions
\d subscriptions
\d credit_usage
```

### Check Storage Buckets
```sql
-- List storage buckets
SELECT * FROM storage.buckets;
```

### Check Functions
```sql
-- List utility functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

### Test Utility Functions
```sql
-- Test credit usage tracking (replace with actual user ID)
SELECT * FROM get_user_current_credits('your-user-uuid-here');

-- Test subscription status
SELECT * FROM get_user_subscription_status('your-user-uuid-here');
```

## Important Notes

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies are automatically enforced

### Storage Structure
- HTML files are stored in the `html-files` bucket
- File paths follow the pattern: `projects/{project_id}/screens/{screen_id}/v{version}/index.html`
- Files are automatically secured by user ownership

### Usage Tracking
- Usage is tracked monthly (YYYY-MM format)
- Counters automatically reset each month
- Utility functions handle usage increment and limit checking

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
5. **Policy/Trigger Syntax**: PostgreSQL does not support IF NOT EXISTS for policies or triggers; use DROP ... IF EXISTS before CREATE ...

### Reset Database (Development Only)

If you need to reset the database during development:

```sql
-- Drop all tables (WARNING: This will delete all data)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run the 001_final_schema.sql migration
```

## Next Steps

After running the migration:

1. Set up your environment variables
2. Configure Supabase Auth
3. Set up Dodo Payments integration
4. Start implementing the API endpoints
5. Connect your React Flow frontend

## Support

If you encounter any issues with the migration:
1. Check the Supabase documentation
2. Verify your database connection
3. Review the error messages carefully
4. Ensure you have the necessary permissions

# Migration Notes

## 2024-XX-XX: Unified Final Schema
- All schema, triggers, functions, storage, and policies are now in a single migration file.
- Credit-based usage tracking is the default.
- All legacy columns and triggers have been removed. 