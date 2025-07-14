import { createClient } from './server';
import { supabaseServiceRole } from './service';

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

        // Get a signed URL for the HTML file (bucket is private) using service role
        const { data, error: urlError } = await supabaseServiceRole
            .storage
            .from('html-files')
            .createSignedUrl(version.html_file_path, 60 * 60); // 1 hour expiry

        if (urlError || !data) {
            console.error('Error creating signed URL for screen:', screen.id);
            console.error('File path:', version.html_file_path);
            console.error('URL Error details:', {
                message: urlError?.message,
                name: urlError?.name,
                cause: urlError?.cause,
                error: urlError
            });
            console.error('Data received:', data);

            // Return screen info with empty URL instead of null to avoid breaking the UI
            return {
                id: screen.id,
                name: screen.name,
                order_index: screen.order_index,
                htmlUrl: '', // Empty URL will cause the iframe to not load, but won't break the UI
            };
        }

        return {
            id: screen.id,
            name: screen.name,
            order_index: screen.order_index,
            htmlUrl: data.signedUrl,
        };
    });

    const results = await Promise.all(screenPromises);
    return results.filter((screen): screen is ProjectScreen => screen !== null);
} 