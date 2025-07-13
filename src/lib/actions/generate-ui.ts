'use server';

import { getAiModel } from '@/lib/ai';
import { generateObject, jsonSchema } from 'ai';
import { createClient, getCurrentUser } from '@/lib/supabase/server';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { redirect } from 'next/navigation';

const systemPrompt = `
You are an expert mobile UI designer and developer. Generate complete, standalone mobile UI components using HTML with Tailwind CSS classes. Always provide the full HTML structure including proper DOCTYPE, html, head, and body tags. Include Tailwind CSS CDN link in the head. Focus on mobile-first design, accessibility, and modern UI patterns. Make sure the component is fully functional and self-contained.
If you are going to use Images make sure that you include only unspalsh images you know for sure exists and fit them according to the screen size. Provide atleast 200 lines of code.
Mobile Frontend Design
Mobile-first approach
Optimizing for touch interactions and mobile-native patterns focusing entirely on mobile user experience.
Provide standalone HTML Pages, use tailwind css
Mobile-First Design Features
Navigation
Bottom tab navigation - Native mobile pattern for easy thumb navigation
Sticky mobile headers with essential actions only
Touch-friendly buttons with proper sizing (44px minimum)
Layout & Spacing
Full-width cards optimized for mobile screens
Vertical stacking instead of grid layouts
Mobile-optimized spacing (16px, 24px system)
Single-column layouts throughout
Interactions
Large touch targets for buttons and interactive elements
Swipe-friendly horizontal scrolling for categories
Mobile gestures support with proper touch feedback
Thumb-zone optimization for primary actions
Content Organization
Condensed information suitable for small screens
Progressive disclosure with expandable sections
Mobile-friendly typography with proper line heights
Compact cards showing essential info first
Mobile-Specific Patterns
Pull-to-refresh ready structure
Infinite scroll for destination lists
Mobile search with full-width input
Bottom sheet style modals (ready for implementation)
Native-feeling animations and transitions
`;

type GenerateUIResult = {
    success: boolean;
    projectId?: string;
    error?: string;
};

export async function generateUIComponent(prompt: string, projectId?: string): Promise<GenerateUIResult> {
    try {
        // Input validation
        if (!prompt || prompt.trim().length === 0) {
            return { success: false, error: 'Prompt is required' };
        }

        if (prompt.length > 1000) {
            return { success: false, error: 'Prompt is too long (max 1000 characters)' };
        }

        // Get authenticated user
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const userId = user.id;
        const supabase = await createClient();
        let finalProjectId = projectId;

        // If no projectId provided, create a new project
        if (!projectId) {
            // Generate unique project name
            const projectName = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: '-',
                length: 3,
                style: 'lowerCase',
            });

            // Create project
            finalProjectId = crypto.randomUUID();

            const { error: projectError } = await supabase.from('projects').insert([
                {
                    id: finalProjectId,
                    user_id: userId,
                    name: projectName,
                    description: prompt,
                    prompt: prompt,
                }
            ]);

            if (projectError) {
                console.error('Project creation error:', projectError);
                return { success: false, error: 'Failed to create project' };
            }
        } else {
            // Verify project exists and user has access
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .eq('user_id', userId)
                .single();

            if (projectError || !project) {
                return { success: false, error: 'Project not found or access denied' };
            }

            // Update project's updated_at timestamp
            const { error: updateError } = await supabase
                .from('projects')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', projectId);

            if (updateError) {
                console.error('Project update error:', updateError);
            }
        }

        // Define schema for LLM response
        const mobileUISchema = jsonSchema<{
            component: {
                name: string;
                description: string;
                html: string;
            };
        }>({
            type: 'object',
            properties: {
                component: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Name of the UI component'
                        },
                        description: {
                            type: 'string',
                            description: 'Brief description of the component'
                        },
                        html: {
                            type: 'string',
                            description: 'Complete HTML markup with Tailwind CSS classes'
                        }
                    },
                    required: ['name', 'description', 'html']
                }
            },
            required: ['component']
        });

        // Generate UI with LLM
        const { object: llmResult } = await generateObject({
            model: getAiModel('openai', 'gpt-4o-mini'),
            system: systemPrompt,
            prompt: prompt,
            schema: mobileUISchema
        });

        // Get the next order index for the screen
        const { data: lastScreen, error: orderError } = await supabase
            .from('screens')
            .select('order_index')
            .eq('project_id', finalProjectId)
            .order('order_index', { ascending: false })
            .limit(1)
            .single();

        const nextOrderIndex = lastScreen ? lastScreen.order_index + 1 : 0;

        // Store HTML in Supabase Storage
        const screenId = crypto.randomUUID();
        const versionId = crypto.randomUUID();
        const htmlFilePath = `projects/${finalProjectId}/screens/${screenId}/v1/index.html`;
        const htmlContent = llmResult.component.html;

        const { error: storageError } = await supabase.storage
            .from('html-files')
            .upload(htmlFilePath, htmlContent, {
                contentType: 'text/html',
                upsert: true,
            });

        if (storageError) {
            console.error('Storage error:', storageError);
            return { success: false, error: 'Failed to upload HTML' };
        }

        // Create screen record
        const { error: screenError } = await supabase.from('screens').insert([
            {
                id: screenId,
                project_id: finalProjectId,
                name: llmResult.component.name,
                order_index: nextOrderIndex,
            }
        ]);

        if (screenError) {
            console.error('Screen creation error:', screenError);
            return { success: false, error: 'Failed to create screen' };
        }

        // Create screen version record
        const { error: versionError } = await supabase.from('screen_versions').insert([
            {
                id: versionId,
                screen_id: screenId,
                version_number: 1,
                user_prompt: prompt,
                ai_prompt: prompt,
                html_file_path: htmlFilePath,
                created_by: userId,
                is_current: true,
            }
        ]);

        if (versionError) {
            console.error('Version creation error:', versionError);
            return { success: false, error: 'Failed to create screen version' };
        }

        return { success: true, projectId: finalProjectId };

    } catch (error) {
        console.error('Generate UI error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

export async function generateUIAndRedirect(formData: FormData) {
    const prompt = formData.get('prompt') as string;
    const projectId = formData.get('projectId') as string | undefined;

    const result = await generateUIComponent(prompt, projectId);

    if (result.success && result.projectId) {
        redirect(`/project/${result.projectId}`);
    } else {
        throw new Error(result.error || 'Failed to generate UI');
    }
} 