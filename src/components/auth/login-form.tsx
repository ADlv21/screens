"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = useCallback(async () => {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
            },
        })
        if (error) {
            console.log("Login Error");
            return
        }
        setIsLoading(false)
        if (data?.url) {
            window.location.href = data.url
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to home link */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>

                {/* Login Card */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-3xl rounded-full" />
                    <Card className="relative bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
                        <CardHeader className="text-center pb-8">
                            {/* Logo */}
                            <div className="flex items-center justify-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">AD</span>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                    AppDraft AI
                                </span>
                            </div>

                            <CardTitle className="text-2xl font-bold text-white mb-2">Welcome back</CardTitle>
                            <CardDescription className="text-slate-300 text-base">
                                Sign in to continue creating beautiful mobile UIs
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Google Login Button */}
                            <Button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin mr-3" />
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Continue with Google
                                    </div>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900/50 text-slate-400">New to AppDraft AI?</span>
                                </div>
                            </div>

                            {/* Sign up link */}
                            <div className="text-center">
                                <p className="text-slate-400">
                                    Don&apos;t have an account?{" "}
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        Create one with Google
                                    </button>
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                                <div className="flex items-center mb-3">
                                    <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                                    <span className="text-sm font-medium text-slate-200">What you&apos;ll get:</span>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3" />20 free mobile screens every month
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3" />
                                        AI-powered UI generation in 30 seconds
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3" />
                                        Export-ready designs and assets
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                            Secure & Private
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                            10,000+ Users
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                            No Spam
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
