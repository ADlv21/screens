'use client'

import Script from 'next/script'
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

declare global {
    interface Window {
        google: any
    }
}

const OneTapComponent = () => {
    const router = useRouter()

    // generate nonce to use for google id token sign-in
    const generateNonce = async (): Promise<string[]> => {
        const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
        const encoder = new TextEncoder()
        const encodedNonce = encoder.encode(nonce)
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        return [nonce, hashedNonce]
    }

    const handleGoogleScriptLoad = useCallback(async () => {
        const [nonce, hashedNonce] = await generateNonce()
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.error('Error getting session', error)
        }
        if (data.session) {
            router.push('/')
            return
        }
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
                callback: async (response: CredentialResponse) => {
                    try {
                        const { data, error } = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: response.credential,
                            nonce,
                        })
                        if (error) throw error
                        router.push('/')
                    } catch (error) {
                        console.error('Error logging in with Google One Tap', error)
                    }
                },
                nonce: hashedNonce,
                use_fedcm_for_prompt: true,
            })
            window.google.accounts.id.prompt()
        }
    }, [router])

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={handleGoogleScriptLoad}
            />
            <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
        </>
    )
}

export default OneTapComponent