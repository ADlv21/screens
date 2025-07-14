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

        // Get product ID from query parameters
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        // Create or get customer
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

        // Create checkout session
        const checkout = await polar.checkouts.create({
            products: [productId],
            successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}?checkout_success=true`,
            customerId: customer.id,
        });

        return NextResponse.redirect(checkout.url);

    } catch (error) {
        console.error('Checkout creation failed:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}

export const POST = GET; 