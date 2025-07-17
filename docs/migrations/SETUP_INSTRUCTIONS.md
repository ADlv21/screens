# AI Screens - Complete Database Setup

## Quick Start

For a **fresh Supabase project**, use this single migration file:

### `complete_setup.sql` ⭐

**What it includes:**

- ✅ All database tables (users, projects, screens, screen_versions, subscriptions, polar_config)
- ✅ Storage bucket for HTML files (5MB limit)
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Utility functions and triggers
- ✅ Auth integration
- ✅ Polar.sh subscription support

## How to Run

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy the entire contents of `complete_setup.sql`**
4. **Paste and execute**

**That's it!** 🎉 Your database is ready.

## What Gets Created

### Tables

- `users` - User profiles (synced with auth.users)
- `projects` - User projects
- `screens` - Project screens
- `screen_versions` - Screen version history
- `subscriptions` - Polar.sh subscription data
- `polar_config` - Credit system configuration

### Storage

- `html-files` bucket - Secure HTML file storage

### Security

- Complete RLS policies - Users can only access their own data
- Storage policies - File access restricted by project ownership

### Automation

- Auto-incrementing version numbers
- Timestamp tracking on updates
- Single current version per screen
- New user creation from auth

## File Structure

HTML files are stored as:

```
projects/{project_id}/screens/{screen_id}/v{version}/index.html
```

## Next Steps

After running the migration:

1. **Configure environment variables** in your app
2. **Set up Polar.sh account** for subscriptions
3. **Test user registration** and project creation
4. **Verify file upload** functionality

## Verification

Check that everything was created:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'html-files';

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;
```

## Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI
OPENAI_API_KEY=your_openai_key

# Polar.sh (optional)
POLAR_ACCESS_TOKEN=your_polar_token
POLAR_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_POLAR_ENVIRONMENT=sandbox
```

## Support

If you encounter any issues:

1. Check the Supabase logs for errors
2. Verify you have the necessary permissions
3. Ensure you're using a fresh project or have cleaned up existing tables
4. Review the success messages in the SQL output

Happy building! 🚀
