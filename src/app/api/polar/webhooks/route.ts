import { Webhooks } from '@polar-sh/nextjs';
import { createClient } from '@/lib/supabase/server';

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET_SANDBOX!,

    // Catch-all handler for all webhook events
    onPayload: async (payload) => {
        try {
            const supabase = await createClient();

            // Handle subscription events
            if (payload.type.startsWith('subscription.')) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = payload.data as any; // Webhook payload data structure varies by event type

                if (payload.type === 'subscription.created' || payload.type === 'subscription.updated') {
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: data.customer?.externalId || data.customer?.external_id,
                            polar_subscription_id: data.id,
                            polar_customer_id: data.customer?.id,
                            status: data.status,
                            current_period_start: data.currentPeriodStart || data.current_period_start,
                            current_period_end: data.currentPeriodEnd || data.current_period_end,
                            updated_at: new Date().toISOString(),
                        }, {
                            onConflict: 'polar_subscription_id'
                        });
                }

                if (payload.type === 'subscription.canceled' || payload.type === 'subscription.revoked') {
                    await supabase
                        .from('subscriptions')
                        .update({
                            status: payload.type === 'subscription.canceled' ? 'canceled' : 'revoked',
                            canceled_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('polar_subscription_id', data.id);
                }
            }

            // Handle customer state changes (for credit updates)
            if (payload.type === 'customer.updated' || payload.type === 'customer.state_changed') {
                // Polar automatically manages credits, so we just acknowledge this
            }

            // Handle benefit grants (when credits are given)
            if (payload.type.startsWith('benefit_grant.')) {
                // Credits are automatically managed by Polar
            }

            // Handle orders (one-time purchases)
            if (payload.type.startsWith('order.')) {
                // Handle order-related events if needed
            }

        } catch (error) {
            console.error('Webhook processing failed:', error);
            // Don't throw - return 200 to acknowledge receipt
        }
    },
}); 