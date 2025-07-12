import { getAiModel } from '@/lib/ai';
import { generateObject, jsonSchema } from 'ai';
import { createClient, getCurrentUser } from '@/lib/supabase/server';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const projectName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
    style: 'lowerCase',
});

const systemPrompt = `
You are an expert mobile UI designer and developer. Generate complete, standalone mobile UI components using HTML with Tailwind CSS classes. Always provide the full HTML structure including proper DOCTYPE, html, head, and body tags. Include Tailwind CSS CDN link in the head. Focus on mobile-first design, accessibility, and modern UI patterns. Make sure the component is fully functional and self-contained.
If you are going to use Images make sure that you include only unspalash images you know for sure exists and fit them according to the screen size. Provide atleast 200 lines of code.
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

export async function POST(req: Request) {
    // 1. Get user and prompt
    const { prompt } = await req.json();
    const user = await getCurrentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const userId = user.id;

    // 2. Create project
    const supabase = await createClient();
    const projectId = crypto.randomUUID();
    // Use random slug for project name if prompt is empty or always if you want
    const projectDesc = prompt;
    const { error: projectError } = await supabase.from('projects').insert([
        {
            id: projectId,
            user_id: userId,
            name: projectName,
            description: projectDesc,
            prompt: prompt,
        }
    ]);
    if (projectError) {
        return new Response(JSON.stringify({ error: 'Failed to create project', details: projectError.message }), { status: 500 });
    }

    // 3. LLM invocation
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

    let llmResult;
    try {
        const { object, usage, providerMetadata } = await generateObject({
            model: getAiModel('openai', 'gpt-4o-mini'),
            system: systemPrompt,
            prompt: prompt,
            schema: mobileUISchema
        });
        console.log({ usage, providerMetadata });
        llmResult = object;
    } catch (error) {
        return new Response(JSON.stringify({ error: 'LLM generation failed', details: error instanceof Error ? error.message : error }), { status: 500 });
    }

    // 4. Store HTML in Supabase Storage
    const screenId = crypto.randomUUID();
    const versionId = crypto.randomUUID();
    const htmlFilePath = `projects/${projectId}/screens/${screenId}/v1/index.html`;
    const htmlContent = llmResult.component.html;

    const { error: storageError } = await supabase.storage
        .from('html-files')
        .upload(htmlFilePath, htmlContent, {
            contentType: 'text/html',
            upsert: true,
        });
    if (storageError) {
        return new Response(JSON.stringify({ error: 'Failed to upload HTML', details: storageError.message }), { status: 500 });
    }

    // 5. Create screen and screen_version records
    const { error: screenError } = await supabase.from('screens').insert([
        {
            id: screenId,
            project_id: projectId,
            name: llmResult.component.name,
            order_index: 0,
        }
    ]);
    if (screenError) {
        return new Response(JSON.stringify({ error: 'Failed to create screen', details: screenError.message }), { status: 500 });
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
        return new Response(JSON.stringify({ error: 'Failed to create screen version', details: versionError.message }), { status: 500 });
    }

    // 6. Return project ID and success
    return new Response(JSON.stringify({ success: true, projectId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
