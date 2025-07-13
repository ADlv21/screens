import { createClient } from './server';

export interface ProjectScreen {
    id: string;
    name: string;
    order_index: number;
    htmlUrl: string;
}

export async function getProjectScreens(projectId: string): Promise<ProjectScreen[]> {
    const supabase = await createClient();

    // Get all screens for the project
    const { data: screens, error: screensError } = await supabase
        .from('screens')
        .select('id, name, order_index')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

    if (screensError || !screens) {
        console.error('Error fetching screens:', screensError);
        return [];
    }

    // Get the latest version for each screen
    const screenPromises = screens.map(async (screen) => {
        const { data: version, error: versionError } = await supabase
            .from('screen_versions')
            .select('html_file_path')
            .eq('screen_id', screen.id)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();

        if (versionError || !version) {
            console.error('Error fetching version for screen:', screen.id, versionError);
            return null;
        }

        // Get a public URL for the HTML file
        const { data: { publicUrl } } = supabase
            .storage
            .from('html-files')
            .getPublicUrl(version.html_file_path);

        return {
            id: screen.id,
            name: screen.name,
            order_index: screen.order_index,
            htmlUrl: publicUrl || '',
        };
    });

    const results = await Promise.all(screenPromises);
    return results.filter((screen): screen is ProjectScreen => screen !== null);
} 