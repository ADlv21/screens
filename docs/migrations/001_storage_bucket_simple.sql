-- =====================
-- SIMPLE STORAGE BUCKET CREATION
-- =====================
-- Create storage bucket without modifying policies
-- The service role approach bypasses RLS anyway

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
    'html-files',
    'html-files',
    false,
    false,
    5242880, -- 5MB limit
    ARRAY['text/html', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket created successfully!';
    RAISE NOTICE '📁 Bucket: html-files is ready for use';
    RAISE NOTICE '🔧 Service role approach will handle uploads';
END $$; 