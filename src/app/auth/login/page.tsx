'use client'

import GoogleOneTap from '@/components/auth/google-one-tap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useCallback } from 'react'

export default function GoogleLoginPage() {
    const router = useRouter()
    const handleGoogleSignIn = useCallback(async () => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
            },
        })
        if (error) {
            // Optionally handle error
            return
        }
        // Supabase will redirect, but fallback just in case
        if (data?.url) {
            window.location.href = data.url
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background/80 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none select-none opacity-10 flex items-center justify-center">
                {/* Optional: Add a subtle SVG or illustration here for background effect */}
                <img src="/globe.svg" alt="Background Illustration" className="w-2/3 max-w-lg" />
            </div>
            <Card className="relative z-10 w-full max-w-md shadow-xl border-border border bg-card/90 backdrop-blur-md">
                <CardHeader className="flex flex-col items-center">
                    <img src="/file.svg" alt="Logo" className="h-12 w-12 mb-2" />
                    <CardTitle className="text-2xl font-bold text-center text-foreground">Sign in to AIScreens</CardTitle>
                    <CardDescription className="text-center text-muted-foreground mt-2">
                        Use your Google account to sign in. No password required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4 mt-2">
                        <GoogleOneTap />
                        <Button onClick={handleGoogleSignIn} className="w-full max-w-xs text-base font-medium">
                            Continue with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 