# Supabase Storage Setup Guide

## 🗂️ Create Storage Bucket via Dashboard

Since SQL migrations can have permission issues with storage, it's better to create the bucket through the Supabase dashboard.

### Step 1: Access Storage in Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"Create a new bucket"**

### Step 2: Create the html-files Bucket

Create a bucket with these settings:
- **Name**: `html-files`
- **Public bucket**: `false` (keep it private)
- **File size limit**: `5 MB`
- **Allowed MIME types**: `text/html, text/plain`

### Step 3: Verify Service Role Key

Make sure your `.env.local` file has the service role key:

```bash
# Your existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add this service role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To find your service role key:**
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **service_role** key (not the anon key)
3. Add it to your `.env.local` file

### Step 4: Test the Setup

The service role approach in our code will:
- ✅ Bypass RLS policies automatically
- ✅ Upload HTML files to the `html-files` bucket
- ✅ Handle all storage operations securely

## 🔧 How It Works

Our implementation uses a service role client that bypasses RLS:

```typescript
// src/lib/supabase/service.ts
export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
```

## 🚨 Security Notes

- **Service role key**: Keep this secret and only use it server-side
- **RLS bypass**: Only our server-side code can bypass RLS policies
- **File structure**: Files are stored as `projects/{projectId}/screens/{screenId}/v1/index.html`

## ✅ Verification

After setup, try generating a screen component. You should see:
- No RLS errors
- HTML files successfully stored in the `html-files` bucket
- Files organized in the correct folder structure

If you still get errors, check:
1. Service role key is correct in `.env.local`
2. Storage bucket exists and is named `html-files`
3. Your Supabase project is active and accessible 