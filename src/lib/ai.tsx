import { groq } from '@ai-sdk/groq';
import { openai } from '@ai-sdk/openai';
import { createVertex } from '@ai-sdk/google-vertex';
import { providerModels } from '@/config';
import { LanguageModelV1 } from 'ai';

type Provider = keyof typeof providerModels;

type ModelMap = { [P in Provider]: (typeof providerModels[P])[number] };

export const getAiModel = <P extends Provider>(provider: P, model: ModelMap[P]): LanguageModelV1 => {
    if (provider == "google") {
        const vertex = createVertex({
            location: 'us-central1',
            project: 'dotted-clover-465411-t1',
            googleAuthOptions: {
                credentials: {
                    client_email: process.env.GOOGLE_API_EMAIL,
                    private_key: process.env.GOOGLE_API_KEY?.split(String.raw`\n`).join('\n'),
                },
            },
        });
        return vertex(model) as LanguageModelV1;
    } else if (provider == 'groq') {
        return groq(model) as LanguageModelV1;
    } else if (provider == 'openai') {
        return openai(model) as LanguageModelV1;
    }
    throw new Error(`Unsupported provider: ${provider}`);
}