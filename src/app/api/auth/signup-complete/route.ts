import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subscribeToFreePlan } from '@/lib/actions/polar-subscription';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the authenticated user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        // Subscribe user to Free Plan
        const subscriptionResult = await subscribeToFreePlan(
            user.id,
            user.email!,
            user.user_metadata?.full_name || user.email?.split('@')[0]
        );

        if (subscriptionResult.success) {
            return NextResponse.json({
                message: 'Successfully subscribed to Free Plan',
                customerId: subscriptionResult.customerId,
            });
        } else {
            console.error('Failed to subscribe user to Free Plan:', subscriptionResult.error);
            return NextResponse.json({
                error: 'Failed to subscribe to Free Plan',
                details: subscriptionResult.error,
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Free Plan subscription error:', error);
        return NextResponse.json({
            error: 'Failed to process Free Plan subscription',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 