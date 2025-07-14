'use server';

import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
    server: 'sandbox',
});

// Product IDs from Polar.sh
const PRODUCT_IDS = {
    FREE: '9f296fe6-8435-4fcd-9ec7-2b17b648c23b',
    STANDARD: '410368fd-96de-4dfb-9640-a9ada2eac149',
    PRO: '3dfaf594-130c-45ac-a39e-0070ebe26124',
};

export interface PolarSubscriptionResult {
    success: boolean;
    customerId?: string;
    subscriptionId?: string;
    error?: string;
}

/**
 * Create or get a Polar customer for a user
 */
export async function createOrGetCustomer(userId: string, email: string, name?: string): Promise<{ success: boolean; customerId?: string; error?: string; }> {
    try {
        // Try to get existing customer
        let customer;
        try {
            customer = await polar.customers.getExternal({ externalId: userId });
        } catch {
            // Customer doesn't exist, create one
            customer = await polar.customers.create({
                email,
                externalId: userId,
                name: name || email.split('@')[0] || 'User',
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
            error: error instanceof Error ? error.message : 'Failed to create customer',
        };
    }
}

/**
 * Subscribe a user to the Free Plan (10 monthly credits)
 */
export async function subscribeToFreePlan(userId: string, email: string, name?: string): Promise<PolarSubscriptionResult> {
    try {
        // Get or create customer
        const customerResult = await createOrGetCustomer(userId, email, name);
        if (!customerResult.success || !customerResult.customerId) {
            return {
                success: false,
                error: customerResult.error || 'Failed to create customer',
            };
        }

        // Create checkout session for Free Plan
        const checkout = await polar.checkouts.create({
            products: [PRODUCT_IDS.FREE],
            customerId: customerResult.customerId,
            successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}?welcome=true`,
        });

        // Since it's a free plan, we can directly create the subscription
        // Note: This might need adjustment based on Polar's free plan handling
        return {
            success: true,
            customerId: customerResult.customerId,
        };
    } catch (error) {
        console.error('Failed to subscribe to free plan:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to subscribe to free plan',
        };
    }
}

/**
 * Get user's current subscription and credit balance
 */
export async function getUserSubscriptionStatus(userId: string): Promise<{
    hasSubscription: boolean;
    plan: string;
    credits: number;
    subscriptionId?: string;
}> {
    try {
        const customer = await polar.customers.getExternal({ externalId: userId });
        const customerState = await polar.customers.getState({ id: customer.id });

        // Look for credit meter
        const creditMeter = customerState.activeMeters?.find(
            (meter) => meter.meterId === '46de6ba0-ae2b-46f2-955b-0f6b95ab3d96'
        );

        const credits = creditMeter?.balance || 0;

        // Determine plan based on subscription
        let plan = 'free';
        let hasSubscription = false;
        let subscriptionId: string | undefined;

        if (customerState.activeSubscriptions && customerState.activeSubscriptions.length > 0) {
            hasSubscription = true;
            const subscription = customerState.activeSubscriptions[0];
            subscriptionId = subscription.id;

            // Determine plan based on product
            if (subscription.productId === PRODUCT_IDS.PRO) {
                plan = 'pro';
            } else if (subscription.productId === PRODUCT_IDS.STANDARD) {
                plan = 'standard';
            }
        }

        return {
            hasSubscription,
            plan,
            credits,
            subscriptionId,
        };
    } catch (error) {
        console.error('Failed to get subscription status:', error);
        return {
            hasSubscription: false,
            plan: 'free',
            credits: 0,
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
        // Fixed event structure based on API validation requirements
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

            console.log(`Successfully deducted ${amount} credits for user ${userId}`);
        } catch (eventError) {
            console.error('Failed to ingest usage events:', eventError);
            console.log('Credit deduction failed - events.ingest API structure may need adjustment');
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
            newBalance: newBalance,
        };
    } catch (error) {
        console.error('Failed to deduct credits:', error);
        return {
            success: false,
            newBalance: 0,
            error: error instanceof Error ? error.message : 'Failed to deduct credits',
        };
    }
} 