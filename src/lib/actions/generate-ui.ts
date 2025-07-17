'use server';

import { getAiModel } from '@/lib/ai';
import { generateObject, jsonSchema } from 'ai';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { createClient, getCurrentUser } from '@/lib/supabase/server';
import { uploadWithServiceRole } from '@/lib/supabase/service';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { redirect } from 'next/navigation';
import { systemPrompt } from '@/config/constants';
import { getUserSubscriptionStatus, deductCredits } from './polar-subscription';

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

        // Check credits via Polar subscription service
        const subscriptionStatus = await getUserSubscriptionStatus(userId);
        const creditsLeft = subscriptionStatus.credits;

        if (creditsLeft <= 0) {
            return {
                success: false,
                error: `Insufficient credits. You have ${creditsLeft} credits remaining.`,
                creditsRemaining: creditsLeft,
                upgradeUrl: "/pricing",
            };
        }

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

            // Verify project was created successfully before proceeding
            const { data: createdProject, error: verifyError } = await supabase
                .from('projects')
                .select('id, user_id')
                .eq('id', finalProjectId)
                .eq('user_id', userId)
                .single();

            if (verifyError || !createdProject) {
                console.error('Project verification error:', verifyError);
                return { success: false, error: 'Failed to verify project creation' };
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
            //model: getAiModel('google', 'gemini-2.5-flash'),
            model: getAiModel('openai', 'gpt-4o-mini'),
            system: systemPrompt,
            prompt: prompt,
            schema: mobileUISchema,
            providerOptions: {
                google: {
                    thinkingConfig: {
                        includeThoughts: true,
                        //thinkingBudget: 2048,
                    },
                } satisfies GoogleGenerativeAIProviderOptions,
            },
            experimental_telemetry: { isEnabled: true },
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

        // Store HTML in Supabase Storage using service role (bypasses RLS)
        const screenId = crypto.randomUUID();
        const versionId = crypto.randomUUID();
        const htmlFilePath = `projects/${finalProjectId}/screens/${screenId}/v1/index.html`;
        const htmlContent = llmResult.component.html;

        const uploadResult = await uploadWithServiceRole(
            'html-files',
            htmlFilePath,
            htmlContent,
            'text/html'
        );

        if (!uploadResult.success) {
            console.error('Storage error:', uploadResult.error);
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

        // Deduct credits after successful generation
        const deductionResult = await deductCredits(userId, 1);
        if (!deductionResult.success) {
            console.error('Failed to deduct credits:', deductionResult.error);
        }

        const updatedCreditsLeft = deductionResult.newBalance;

        return {
            success: true,
            projectId: finalProjectId,
            creditsRemaining: updatedCreditsLeft,
        };

    } catch (error) {
        console.error('Generate UI error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
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