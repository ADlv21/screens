# Supabase Auth Setup Guide

This guide will help you set up Supabase Authentication for your mobile UI generator app.

## Prerequisites

1. **Supabase Project**: You need a Supabase project set up
2. **Environment Variables**: Configure your environment variables
3. **Dependencies**: Install required packages

## Step 1: Install Dependencies

First, install the required Supabase packages:

```bash
npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` to resolve the Zod version conflict.

## Step 2: Environment Variables

Create or update your `.env.local` file with your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Providers
OPENAI_API_KEY=your_openai_api_key

# Polar.sh Payments (Sandbox)
POLAR_ACCESS_TOKEN_SANDBOX=your_polar_access_token
POLAR_WEBHOOK_SECRET_SANDBOX=your_polar_webhook_secret
```

## Step 3: Supabase Dashboard Configuration

### 3.1 Enable Email Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email settings:
   - **Enable email confirmations**: Yes
   - **Secure email change**: Yes
   - **Double confirm changes**: Yes

### 3.2 Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Update the **Confirm signup** template:
   - Change `{{ .ConfirmationURL }}` to `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`
3. Customize other email templates as needed

### 3.3 Set Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set your **Site URL** (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - Your production URLs when deployed

## Step 4: Database Setup

Run the database migrations we created earlier:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the migration files in order:
   - `001_initial_schema.sql`
   - `002_storage_setup.sql`
   - `003_utility_functions.sql`

## Step 5: Test the Setup

### 5.1 Start the Development Server

```bash
npm run dev
```

### 5.2 Test Authentication Flow

1. Visit `http://localhost:3000/auth/login`
2. Try creating a new account
3. Check your email for confirmation
4. Sign in with your credentials
5. You should be redirected to `/dashboard`

## Step 6: Integration with Your App

### 6.1 Using Auth in Components

```tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'

export default function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### 6.2 Server-Side Auth Check

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <div>Protected content for {user.email}</div>
}
```

### 6.3 API Route Protection

```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your protected API logic here
  return NextResponse.json({ message: 'Hello, ' + user.email })
}
```

## Step 7: User Profile Management

### 7.1 Create User Profile on Sign Up

When a user signs up, you'll want to create a profile in your `users` table. You can do this with a database trigger or in your signup flow.

### 7.2 Update User Profile

```tsx
const updateProfile = async (updates: { name?: string }) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
  
  if (error) console.error('Error updating profile:', error)
}
```

## Step 8: Production Deployment

### 8.1 Update Environment Variables

For production, update your environment variables with production URLs:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### 8.2 Update Supabase Settings

1. Update **Site URL** in Supabase dashboard
2. Add production redirect URLs
3. Configure production email settings

### 8.3 Custom Domain (Optional)

If using a custom domain:
1. Add your custom domain to Supabase redirect URLs
2. Update your environment variables
3. Configure DNS settings

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check if email confirmation is required
   - Verify user exists in Supabase Auth

2. **"Redirect URL not allowed"**
   - Add the redirect URL to Supabase settings
   - Check for trailing slashes

3. **"Email not received"**
   - Check spam folder
   - Verify email template configuration
   - Check Supabase email logs

4. **"Session not persisting"**
   - Verify middleware configuration
   - Check cookie settings
   - Ensure proper SSR setup

### Debug Mode

Enable debug mode in your Supabase client:

```tsx
const supabase = createClient()
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
})
```

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to protect your data
3. **Validate user input** on both client and server
4. **Implement rate limiting** for auth endpoints
5. **Use HTTPS** in production
6. **Regular security audits** of your auth flow

## Next Steps

After setting up authentication:

1. **Implement user onboarding** flow
2. **Add social login** providers (Google, GitHub)
3. **Set up password reset** functionality
4. **Implement email verification** reminders
5. **Add user profile** management
6. **Integrate with your subscription** system

## Support

If you encounter issues:

1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review the [Next.js Auth helpers guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
3. Check your browser's network tab for errors
4. Review Supabase dashboard logs 