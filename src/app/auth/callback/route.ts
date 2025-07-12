import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (!exchangeError) {
            redirect(next)
        } else {
            const errorUrl = new URL('/auth/error', request.url)
            errorUrl.searchParams.set('error', 'code_exchange_failed')
            errorUrl.searchParams.set('error_description', exchangeError.message)
            redirect(errorUrl.toString())
        }
    }

    // Handle magic link flow (with token and type parameters)
    if (token_hash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!verifyError) {
            redirect(next)
        } else {
            const errorUrl = new URL('/auth/error', request.url)
            errorUrl.searchParams.set('error', 'verification_failed')
            errorUrl.searchParams.set('error_description', verifyError.message)
            redirect(errorUrl.toString())
        }
    }

    // No valid parameters provided
    const errorUrl = new URL('/auth/error', request.url)
    errorUrl.searchParams.set('error', 'invalid_request')
    errorUrl.searchParams.set('error_description', 'No valid authentication parameters found')
    redirect(errorUrl.toString())
} 