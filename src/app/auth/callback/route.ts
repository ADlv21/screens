import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { subscribeToFreePlan } from '@/lib/actions/polar-subscription'

// Helper function to check if user needs free plan subscription
async function shouldSubscribeUserToFreePlan(userId: string): Promise<boolean> {
    try {
        const supabase = await createClient()

        // Check if user already has a subscription record
        const { data: existingSubscription, error } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error('Error checking existing subscription:', error)
            return false
        }

        // If no subscription exists, user needs free plan
        return !existingSubscription
    } catch (error) {
        console.error('Error in shouldSubscribeUserToFreePlan:', error)
        return false
    }
}

// Helper function to handle free plan subscription
async function handleFreePlanSubscription(userId: string, email: string, name?: string) {
    try {
        console.log(`Subscribing new user ${email} to free plan...`)

        const result = await subscribeToFreePlan(userId, email, name)

        if (result.success) {
            console.log(`Successfully subscribed user ${email} to free plan. Customer ID: ${result.customerId}`)
        } else {
            console.error(`Failed to subscribe user ${email} to free plan:`, result.error)
        }
    } catch (error) {
        console.error(`Error subscribing user ${email} to free plan:`, error)
        // Don't throw - we don't want to block the auth flow
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    // Handle auth errors
    if (error) {
        const errorUrl = new URL('/auth/error', request.url)
        errorUrl.searchParams.set('error', error)
        if (error_description) {
            errorUrl.searchParams.set('error_description', error_description)
        }
        redirect(errorUrl.toString())
    }

    const supabase = await createClient()

    // Handle OAuth/PKCE flow (with code parameter)
    if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            const errorUrl = new URL('/auth/error', request.url)
            errorUrl.searchParams.set('error', 'code_exchange_failed')
            errorUrl.searchParams.set('error_description', exchangeError.message)
            redirect(errorUrl.toString())
        }

        if (data.user) {
            // Check if user needs free plan subscription (more reliable than time-based)
            const needsFreePlan = await shouldSubscribeUserToFreePlan(data.user.id)

            if (needsFreePlan) {
                await handleFreePlanSubscription(
                    data.user.id,
                    data.user.email!,
                    data.user.user_metadata?.full_name || data.user.email?.split('@')[0]
                )
            }
        }

        redirect(next)
    }

    // Handle magic link flow (with token and type parameters)
    if (token_hash && type) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (verifyError) {
            const errorUrl = new URL('/auth/error', request.url)
            errorUrl.searchParams.set('error', 'verification_failed')
            errorUrl.searchParams.set('error_description', verifyError.message)
            redirect(errorUrl.toString())
        }

        if (data.user) {
            // Check if user needs free plan subscription (more reliable than time-based)
            const needsFreePlan = await shouldSubscribeUserToFreePlan(data.user.id)

            if (needsFreePlan) {
                await handleFreePlanSubscription(
                    data.user.id,
                    data.user.email!,
                    data.user.user_metadata?.full_name || data.user.email?.split('@')[0]
                )
            }
        }

        redirect(next)
    }

    // If no token_hash or code, redirect to login
    redirect('/auth/login')
} 