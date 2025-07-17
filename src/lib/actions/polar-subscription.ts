'use server';

import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
    server: 'sandbox',
});

// Unified Plan Configuration (minimal)
const PLAN_CONFIG = {
    free: {
        productId: '9f296fe6-8435-4fcd-9ec7-2b17b648c23b',
    },
    standard: {
        productId: '410368fd-96de-4dfb-9640-a9ada2eac149',
    },
    pro: {
        productId: '3dfaf594-130c-45ac-a39e-0070ebe26124',
    }
} as const;

const CREDIT_METER_ID = '46de6ba0-ae2b-46f2-955b-0f6b95ab3d96';

export interface PolarSubscriptionResult {
    success: boolean;
    customerId?: string;
    subscriptionId?: string;
    error?: string;
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
            (meter) => meter.meterId === CREDIT_METER_ID
        );

        const credits = creditMeter?.balance || 0;

        // Determine plan based on active subscriptions
        let plan = 'You have no active subscription';
        if (state.activeSubscriptions && state.activeSubscriptions.length > 0) {
            const subscription = state.activeSubscriptions[0];
            if (subscription.productId === PLAN_CONFIG.free.productId) { 
                plan = 'free';
            } else if (subscription.productId === PLAN_CONFIG.standard.productId) {
                plan = 'standard';
            } else if (subscription.productId === PLAN_CONFIG.pro.productId) {
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
                    meter_id: CREDIT_METER_ID,
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
            (meter) => meter.meterId === CREDIT_METER_ID
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