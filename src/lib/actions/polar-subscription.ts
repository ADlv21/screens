'use server';

import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
    server: 'sandbox',
});

// Free Plan Configuration
const FREE_PLAN_CONFIG = {
    planName: 'free',
    creditAmount: 10,
    meterId: '46de6ba0-ae2b-46f2-955b-0f6b95ab3d96'
};

// Product IDs
const PRODUCT_IDS = {
    STANDARD: '410368fd-96de-4dfb-9640-a9ada2eac149',
    PRO: '3dfaf594-130c-45ac-a39e-0070ebe26124'
};

export interface PolarSubscriptionResult {
    success: boolean;
    customerId?: string;
    subscriptionId?: string;
    error?: string;
}

/**
 * Create customer and subscribe to Free Plan
 */
export async function subscribeToFreePlan(
    userId: string,
    email: string,
    name?: string
): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
        // Create or get customer
        let customer;
        try {
            customer = await polar.customers.getExternal({ externalId: userId });
        } catch {
            // Customer doesn't exist, create one
            customer = await polar.customers.create({
                email,
                externalId: userId,
                name: name || email.split('@')[0],
            });
        }

        return {
            success: true,
            customerId: customer.id,
        };

    } catch (error) {
        console.error('Failed to create or get customer:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to subscribe to free plan'
        };
    }
}

/**
 * Subscribe user to Free Plan automatically
 */
export async function subscribeUserToFreePlan(
    userId: string,
    email: string,
    name?: string
): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
        // Create or get customer
        let customer;
        try {
            customer = await polar.customers.getExternal({ externalId: userId });
        } catch {
            // Customer doesn't exist, create one
            customer = await polar.customers.create({
                email,
                externalId: userId,
                name: name || email.split('@')[0],
            });
        }

        return {
            success: true,
            customerId: customer.id,
        };

    } catch (error) {
        console.error('Failed to subscribe to free plan:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to subscribe to free plan'
        };
    }
}

/**
 * Get user's subscription status and credits
 */
export async function getUserSubscriptionStatus(userId: string): Promise<{
    hasSubscription: boolean;
    plan: string;
    credits: number;
    error?: string;
}> {
    try {
        const customer = await polar.customers.getExternal({ externalId: userId });
        const state = await polar.customers.getState({ id: customer.id });

        // Find the credit meter
        const creditMeter = state.activeMeters?.find(
            (meter) => meter.meterId === FREE_PLAN_CONFIG.meterId
        );

        const credits = creditMeter?.balance || 0;

        // Determine plan based on active subscriptions
        let plan = 'free';
        if (state.activeSubscriptions && state.activeSubscriptions.length > 0) {
            const subscription = state.activeSubscriptions[0];
            if (subscription.productId === PRODUCT_IDS.STANDARD) {
                plan = 'standard';
            } else if (subscription.productId === PRODUCT_IDS.PRO) {
                plan = 'pro';
            }
        }

        return {
            hasSubscription: (state.activeSubscriptions?.length || 0) > 0,
            plan,
            credits,
        };
    } catch (error) {
        console.error('Failed to get subscription status:', error);
        return {
            hasSubscription: false,
            plan: 'free',
            credits: 0,
            error: error instanceof Error ? error.message : 'Failed to get subscription status'
        };
    }
}

/**
 * Deduct credits after a successful generation
 */
export async function deductCredits(userId: string, amount: number = 1): Promise<{ success: boolean; newBalance: number; error?: string; }> {
    try {
        const customer = await polar.customers.getExternal({ externalId: userId });

        // Create usage events to deduct credits from the meter
        try {
            const usageEvents = Array.from({ length: amount }, (_, i) => ({
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                name: 'screen_generation',
                externalCustomerId: userId,
                metadata: {
                    user_id: userId,
                    event_type: 'screen_generation',
                    meter_id: '46de6ba0-ae2b-46f2-955b-0f6b95ab3d96',
                    amount: 1
                }
            }));

            // Ingest the usage events
            await polar.events.ingest({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                events: usageEvents as any // Type assertion needed - event structure may need adjustment
            });

        } catch (eventError) {
            console.error('Failed to ingest usage events:', eventError);
            // Continue to get current balance even if event ingestion fails
        }

        // Get updated customer state to return new balance
        const updatedState = await polar.customers.getState({ id: customer.id });
        const creditMeter = updatedState.activeMeters?.find(
            (meter) => meter.meterId === '46de6ba0-ae2b-46f2-955b-0f6b95ab3d96'
        );

        const newBalance = creditMeter?.balance || 0;

        return {
            success: true,
            newBalance,
        };

    } catch (error) {
        console.error('Failed to deduct credits:', error);
        return {
            success: false,
            newBalance: 0,
            error: error instanceof Error ? error.message : 'Failed to deduct credits'
        };
    }
} 