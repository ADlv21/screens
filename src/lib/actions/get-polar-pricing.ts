'use server';

import polar from './get-polar';

export interface PricingPlan {
    id: string;
    name: string;
    description: string | null;
    price: number; // in cents
    currency: string;
    interval: string;
    credits: number;
    isFree: boolean;
    features: string[];
}

export async function getPolarPricingPlans() {
    const response = await polar.products.list({
        limit: 10,
        isArchived: false,
    });
    return response;
}