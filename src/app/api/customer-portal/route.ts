import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import polar from '@/lib/actions/get-polar';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        let customer;
        try {
            customer = await polar.customers.getExternal({ externalId: user.id });
        } catch {
            // Customer doesn't exist, create one
            customer = await polar.customers.create({
                email: user.email!,
                externalId: user.id,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            });
        }

        const session = await polar.customerSessions.create({
            customerId: customer.id,
        });

        return NextResponse.redirect(session.customerPortalUrl);

    } catch (error) {
        console.error('Customer portal creation failed:', error);
        return NextResponse.json({ error: 'Failed to create customer portal' }, { status: 500 });
    }
}

export const POST = GET; 