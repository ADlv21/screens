import { NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
    server: 'sandbox',
});

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the authenticated user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        // Get customer by external ID
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

        // Redirect to Polar customer portal
        const portalUrl = `https://sandbox.polar.sh/customers/${customer.id}`;
        return NextResponse.redirect(portalUrl);

    } catch (error) {
        console.error('Customer portal creation failed:', error);
        return NextResponse.json({ error: 'Failed to create customer portal' }, { status: 500 });
    }
}

export const POST = GET; 