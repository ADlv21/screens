import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/actions/polar-subscription';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the authenticated user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        // Get subscription status from Polar
        const subscriptionStatus = await getUserSubscriptionStatus(user.id);

        return NextResponse.json({
            credits: subscriptionStatus.credits,
            plan: subscriptionStatus.plan,
            hasSubscription: subscriptionStatus.hasSubscription,
            subscriptionId: subscriptionStatus.subscriptionId,
        });

    } catch (error) {
        console.error('Credit status error:', error);
        return NextResponse.json({
            error: 'Failed to get credit status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 