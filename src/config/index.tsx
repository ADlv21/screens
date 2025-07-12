export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export interface PricingTier {
    name: string;
    id: string;
    price: Record<string, number | string>;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
    popular?: boolean;
}

export const TIERS: PricingTier[] = [
    {
        id: "individuals",
        name: "Individuals",
        price: {
            monthly: "Free",
            yearly: "Free",
        },
        description: "For your hobby projects",
        features: [
            "Free email alerts",
            "3-minute checks",
            "Automatic data enrichment",
            "10 monitors",
            "Up to 3 seats",
        ],
        cta: "Get started",
    },
    {
        id: "teams",
        name: "Teams",
        price: {
            monthly: 90,
            yearly: 75,
        },
        description: "Great for small businesses",
        features: [
            "Unlimited phone calls",
            "30 second checks",
            "Single-user account",
            "20 monitors",
            "Up to 6 seats",
        ],
        cta: "Get started",
        popular: true,
    },
    {
        id: "organizations",
        name: "Organizations",
        price: {
            monthly: 120,
            yearly: 100,
        },
        description: "Great for large businesses",
        features: [
            "Unlimited phone calls",
            "15 second checks",
            "Single-user account",
            "50 monitors",
            "Up to 10 seats",
        ],
        cta: "Get started",
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: {
            monthly: "Custom",
            yearly: "Custom",
        },
        description: "For multiple teams",
        features: [
            "Everything in Organizations",
            "Up to 5 team members",
            "100 monitors",
            "15 status pages",
            "200+ integrations",
        ],
        cta: "Contact Us",
        highlighted: true,
    },
];

export const providerModels = {
    openai: [
        'gpt-4o',
        "gpt-4o-mini",
        'gpt-4.1-mini',
    ],
    google: [
        'gemini-2.5-pro',
        'gemini-2.5-flash',
        "claude-sonnet-4@20250514",
        "claude-opus-4@20250514"
    ],
    groq: [
        'llama-3-groq-70b-tool',
    ],
} as const;