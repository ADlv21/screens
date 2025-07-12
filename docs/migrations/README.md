# Database Migrations

This directory contains the SQL migration scripts for setting up the mobile UI generator database schema.

## Migration Files

### 001_initial_schema.sql
- Creates all database tables (users, projects, screens, screen_versions, subscriptions, credit_usage)
- Sets up Row Level Security (RLS) policies
- Creates database triggers for automatic updates
- Adds performance indexes
- Includes comprehensive documentation

### 002_storage_setup.sql
- Creates Supabase Storage buckets for HTML files and project assets
- Sets up storage policies for secure file access
- Configures file size limits and allowed MIME types

### 003_utility_functions.sql
- Creates utility functions for common database operations
- Includes usage tracking and limit checking functions
- Provides helper functions for version management

## How to Run Migrations

### Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Run each migration file in order:
   - Copy and paste the contents of `001_initial_schema.sql`
   - Execute the script
   - Repeat for `002_storage_setup.sql`
   - Repeat for `003_utility_functions.sql`

## Verification

After running the migrations, you can verify the setup:

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
-- Test usage tracking (replace with actual user ID)
SELECT * FROM get_user_current_usage('your-user-uuid-here');

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
- File paths follow the pattern: `{user_id}/{project_id}/{screen_id}/v{version}/index.html`
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
4. **Triggers**: Check that triggers are working correctly

### Reset Database (Development Only)

If you need to reset the database during development:

```sql
-- Drop all tables (WARNING: This will delete all data)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run all migrations
```

## Next Steps

After running the migrations:

1. Set up your environment variables
2. Configure Supabase Auth
3. Set up Dodo Payments integration
4. Start implementing the API endpoints
5. Connect your React Flow frontend

## Support

If you encounter any issues with the migrations:

1. Check the Supabase documentation
2. Verify your database connection
3. Review the error messages carefully
4. Ensure you have the necessary permissions 