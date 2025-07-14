-- =====================
-- STORAGE BUCKET FIX
-- =====================
-- Fix storage bucket creation and RLS policies
-- Date: 2024-12-XX

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types, owner, created_at, updated_at)
VALUES (
    'html-files',
    'html-files',
    false,
    false,
    5242880, -- 5MB limit
    ARRAY['text/html', 'text/plain'],
    NULL,
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;

-- Remove existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own HTML files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own HTML files" ON storage.objects;

-- Create improved storage policies
CREATE POLICY "Users can upload their own HTML files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'html-files' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = 'projects' AND
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id::text = (storage.foldername(name))[2] 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own HTML files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'html-files' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = 'projects' AND
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id::text = (storage.foldername(name))[2] 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own HTML files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'html-files' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = 'projects' AND
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id::text = (storage.foldername(name))[2] 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own HTML files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'html-files' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = 'projects' AND
    EXISTS (
        SELECT 1 FROM projects 
        WHERE id::text = (storage.foldername(name))[2] 
        AND user_id = auth.uid()
    )
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a service role policy for system operations (optional)
CREATE POLICY "Service role can manage all files"
ON storage.objects FOR ALL
USING (
    bucket_id = 'html-files' AND
    auth.jwt() ->> 'role' = 'service_role'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket and RLS policies fixed!';
    RAISE NOTICE '📁 Bucket: html-files created/updated';
    RAISE NOTICE '🔒 RLS policies updated with improved logic';
    RAISE NOTICE '⚡ Service role policy added for system operations';
END $$; 