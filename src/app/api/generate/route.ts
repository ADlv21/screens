import { generateObject, jsonSchema } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

const systemPrompt = `
You are an expert mobile UI designer and developer. Generate complete, standalone mobile UI components using HTML with Tailwind CSS classes. Always provide the full HTML structure including proper DOCTYPE, html, head, and body tags. Include Tailwind CSS CDN link in the head. Focus on mobile-first design, accessibility, and modern UI patterns. Make sure the component is fully functional and self-contained.
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
`
export async function POST(req: Request) {
    const { prompt } = await req.json();

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

    try {
        const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            prompt: `Create meditation and mindfulness app (3 screens)
                    Serene, calming design with nature - inspired color palette
                    Soft pastel backgrounds with subtle organic patterns and breathing animations
                    Gentle typography using Poppins font family for tranquil reading experience
                    Flowing layouts with circular elements mimicking ripples in water
                    Muted earth tones with careful attention to visual hierarchy
                    Smooth, zen- like transitions that promote mental clarity and focus.`,
            schema: mobileUISchema,
        });

        return new Response(
            JSON.stringify({ data: object }),
            {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    } catch (error) {
        console.error('Generation error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate response',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
