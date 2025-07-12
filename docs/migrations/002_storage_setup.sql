-- Migration: 002_storage_setup.sql
-- Description: Set up Supabase Storage buckets for HTML files
-- Date: 2024-01-XX

-- Create storage bucket for HTML files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'html-files',
    'html-files',
    true,
    5242880, -- 5MB limit
    ARRAY['text/html', 'text/plain']
);

-- Create storage bucket for project assets (if needed later)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-assets',
    'project-assets',
    true,
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Storage policies for html-files bucket
CREATE POLICY "Users can upload their own HTML files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own HTML files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own HTML files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own HTML files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'html-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for project-assets bucket
CREATE POLICY "Users can upload their own project assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own project assets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own project assets" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own project assets" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'project-assets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    ); 