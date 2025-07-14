'use server';

import { getAiModel } from '@/lib/ai';
import { generateObject, jsonSchema } from 'ai';
import { createClient, getCurrentUser } from '@/lib/supabase/server';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { redirect } from 'next/navigation';

// TODO: Install @polar-sh/nextjs first
// import { polar } from '@polar-sh/nextjs';

const systemPrompt = `
You are an expert mobile UI designer and developer. Generate complete, standalone mobile UI components using HTML with Tailwind CSS classes...
`;

type GenerateUIResult = {
    success: boolean;
    projectId?: string;
    error?: string;
    creditsRemaining?: number;
    upgradeUrl?: string;
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

        // Check credits via Polar API (replaces database check)
        try {
            // TODO: Uncomment when Polar SDK is installed
            /*
            const customerState = await polar.customers.getState({
                external_id: userId
            });
            
            const creditMeter = customerState.meters?.find(
                meter => meter.name === 'screen_generation_meter'
            );
            
            const creditsLeft = creditMeter?.balance || 0;
            
            if (creditsLeft <= 0) {
                // Get checkout URL for upgrade
                const checkout = await polar.checkout.create({
                    product_id: 'your_standard_product_id', // From Polar dashboard
                    customer_email: user.email,
                    success_url: `${process.env.NEXT_PUBLIC_URL}/project/${projectId || 'new'}`,
                    external_customer_id: userId
                });
                
                return {
                    success: false,
                    error: `Insufficient credits. You have ${creditsLeft} credits remaining.`,
                    creditsRemaining: creditsLeft,
                    upgradeUrl: checkout.url
                };
            }
            */

            // Temporary placeholder while Polar isn't set up
            const creditsLeft = 100; // Remove this when Polar is connected

        } catch (polarError) {
            console.error('Polar credit check failed:', polarError);
            // Fallback: allow generation but log the error
            // In production, you might want to fail here
        }

        let finalProjectId = projectId;

        // Project creation/validation logic (unchanged)
        if (!projectId) {
            const projectName = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: '-',
                length: 3,
                style: 'lowerCase',
            });

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
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .eq('user_id', userId)
                .single();

            if (projectError || !project) {
                return { success: false, error: 'Project not found or access denied' };
            }

            const { error: updateError } = await supabase
                .from('projects')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', projectId);

            if (updateError) {
                console.error('Project update error:', updateError);
            }
        }

        // LLM generation logic (unchanged)
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
                        name: { type: 'string', description: 'Name of the UI component' },
                        description: { type: 'string', description: 'Brief description of the component' },
                        html: { type: 'string', description: 'Complete HTML markup with Tailwind CSS classes' }
                    },
                    required: ['name', 'description', 'html']
                }
            },
            required: ['component']
        });

        const { object: llmResult } = await generateObject({
            model: getAiModel('openai', 'gpt-4o-mini'),
            system: systemPrompt,
            prompt: prompt,
            schema: mobileUISchema
        });

        // Storage and database logic (unchanged)
        const { data: lastScreen } = await supabase
            .from('screens')
            .select('order_index')
            .eq('project_id', finalProjectId)
            .order('order_index', { ascending: false })
            .limit(1)
            .single();

        const nextOrderIndex = lastScreen ? lastScreen.order_index + 1 : 0;
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

        // Send usage event to Polar (this auto-deducts credits)
        try {
            // TODO: Uncomment when Polar SDK is installed
            /*
            await polar.events.create({
                name: 'screen_generation',
                external_customer_id: userId,
                metadata: {
                    project_id: finalProjectId,
                    screen_id: screenId,
                    credits_used: 1,
                    prompt_length: prompt.length,
                    component_name: llmResult.component.name
                }
            });
            */
        } catch (polarError) {
            console.error('Polar event tracking failed:', polarError);
            // Don't fail the generation for analytics issues
        }

        // Get updated credit balance from Polar
        let creditsRemaining = 0;
        try {
            // TODO: Uncomment when Polar SDK is installed
            /*
            const updatedState = await polar.customers.getState({
                external_id: userId
            });
            const creditMeter = updatedState.meters?.find(
                meter => meter.name === 'screen_generation_meter'
            );
            creditsRemaining = creditMeter?.balance || 0;
            */
            creditsRemaining = 99; // Temporary placeholder
        } catch (error) {
            console.error('Failed to get updated credit balance:', error);
        }

        return {
            success: true,
            projectId: finalProjectId,
            creditsRemaining
        };

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