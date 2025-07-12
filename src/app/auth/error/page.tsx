'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    const getErrorInfo = () => {
        switch (error) {
            case 'access_denied':
                return {
                    title: 'Access Denied',
                    message: 'Your email confirmation link has expired or is invalid.',
                    action: 'Please request a new confirmation email.',
                    showResend: true
                }
            case 'otp_expired':
                return {
                    title: 'Link Expired',
                    message: 'Your email confirmation link has expired.',
                    action: 'Please request a new confirmation email.',
                    showResend: true
                }
            case 'verification_failed':
                return {
                    title: 'Verification Failed',
                    message: errorDescription || 'There was an error verifying your email.',
                    action: 'Please try again or contact support.',
                    showResend: false
                }
            case 'invalid_request':
                return {
                    title: 'Invalid Request',
                    message: errorDescription || 'The authentication request was invalid.',
                    action: 'Please try signing up again.',
                    showResend: false
                }
            default:
                return {
                    title: 'Authentication Error',
                    message: errorDescription || 'There was an error with your authentication.',
                    action: 'Please try again.',
                    showResend: false
                }
        }
    }

    const errorInfo = getErrorInfo()

    const handleResendEmail = async () => {
        // Redirect to resend confirmation page
        window.location.href = '/auth/resend'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {errorInfo.title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {errorInfo.message}
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        {errorInfo.action}
                    </p>
                </div>

                <div className="space-y-4">
                    {errorInfo.showResend && (
                        <Button
                            onClick={handleResendEmail}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            Request New Confirmation Email
                        </Button>
                    )}

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Return to login
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="text-xs text-gray-600">
                            <strong>Error Code:</strong> {error}
                        </p>
                        {errorDescription && (
                            <p className="text-xs text-gray-600 mt-1">
                                <strong>Details:</strong> {errorDescription}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// Loading fallback component
function AuthErrorLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        </div>
    )
}

// Main page component with Suspense boundary
export default function AuthErrorPage() {
    return (
        <Suspense fallback={<AuthErrorLoading />}>
            <AuthErrorContent />
        </Suspense>
    )
} 