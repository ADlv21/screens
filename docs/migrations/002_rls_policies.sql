-- Enable RLS for all relevant tables (if not already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to insert/select/update their own projects
CREATE POLICY "Allow user insert project"
  ON projects
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow user select project"
  ON projects
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Allow users to insert/select screens for their own projects
CREATE POLICY "Allow user insert screen"
  ON screens
  FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Allow user select screen"
  ON screens
  FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Policy: Allow users to insert/select screen_versions for their own screens
CREATE POLICY "Allow user insert screen_version"
  ON screen_versions
  FOR INSERT
  WITH CHECK (
    screen_id IN (
      SELECT id FROM screens WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Allow user select screen_version"
  ON screen_versions
  FOR SELECT
  USING (
    screen_id IN (
      SELECT id FROM screens WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    )
  );

-- Storage: Allow authenticated users to upload to html-files bucket
-- (Supabase storage uses the storage.objects table)
CREATE POLICY "Allow authenticated upload to html-files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'html-files' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated read html-files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'html-files' AND auth.role() = 'authenticated'
  );