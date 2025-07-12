import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    // Handle auth errors
    if (error) {
        console.error('Auth error:', error, error_description)

        // Redirect to error page with specific error information
        const errorUrl = new URL('/auth/error', request.url)
        errorUrl.searchParams.set('error', error)
        if (error_description) {
            errorUrl.searchParams.set('error_description', error_description)
        }
        redirect(errorUrl.toString())
    }

    if (token_hash && type) {
        const supabase = await createClient()
        const { error: verifyError } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!verifyError) {
            // Successfully verified, redirect to home
            redirect(next)
        } else {
            console.error('OTP verification error:', verifyError)
            // Redirect to error page with verification error
            const errorUrl = new URL('/auth/error', request.url)
            errorUrl.searchParams.set('error', 'verification_failed')
            errorUrl.searchParams.set('error_description', verifyError.message)
            redirect(errorUrl.toString())
        }
    }

    // No token or type provided, redirect to error page
    const errorUrl = new URL('/auth/error', request.url)
    errorUrl.searchParams.set('error', 'invalid_request')
    errorUrl.searchParams.set('error_description', 'Missing token or type parameter')
    redirect(errorUrl.toString())
} 