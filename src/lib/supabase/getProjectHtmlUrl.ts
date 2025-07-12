import { createClient } from './server';

export async function getProjectHtmlUrl(projectId: string): Promise<string | null> {
    const supabase = await createClient();

    // Get the latest screen for the project
    const { data: screen, error: screenError } = await supabase
        .from('screens')
        .select('id')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

    if (screenError || !screen) return null;

    // Get the latest version for the screen
    const { data: version, error: versionError } = await supabase
        .from('screen_versions')
        .select('html_file_path')
        .eq('screen_id', screen.id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

    if (versionError || !version) return null;

    // Get a public URL for the HTML file
    const { data: { publicUrl } } = supabase
        .storage
        .from('html-files')
        .getPublicUrl(version.html_file_path);

    return publicUrl || null;
}
