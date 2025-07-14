'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, CreditCard, ArrowUp } from 'lucide-react'

interface CreditStatus {
    credits: number
    plan: string
    hasSubscription: boolean
    loading: boolean
    error?: string
}

export default function CreditStatus() {
    const { user } = useAuth()
    const [status, setStatus] = useState<CreditStatus>({
        credits: 0,
        plan: 'free',
        hasSubscription: false,
        loading: true,
    })

    useEffect(() => {
        if (user) {
            fetchCreditStatus()
        }
    }, [user])

    const fetchCreditStatus = async () => {
        try {
            setStatus(prev => ({ ...prev, loading: true }))

            const response = await fetch('/api/user/credit-status')
            if (!response.ok) {
                throw new Error('Failed to fetch credit status')
            }

            const data = await response.json()
            setStatus({
                credits: data.credits,
                plan: data.plan,
                hasSubscription: data.hasSubscription,
                loading: false,
            })
        } catch (error) {
            console.error('Error fetching credit status:', error)
            setStatus(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }))
        }
    }

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'free':
                return 'bg-gray-100 text-gray-800'
            case 'standard':
                return 'bg-blue-100 text-blue-800'
            case 'pro':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPlanName = (plan: string) => {
        switch (plan) {
            case 'free':
                return 'Free Plan'
            case 'standard':
                return 'Standard Plan'
            case 'pro':
                return 'Pro Plan'
            default:
                return 'Free Plan'
        }
    }

    const getUpgradeUrl = (currentPlan: string) => {
        if (currentPlan === 'free') {
            return '/api/checkout?product_id=410368fd-96de-4dfb-9640-a9ada2eac149' // Standard Plan
        } else if (currentPlan === 'standard') {
            return '/api/checkout?product_id=3dfaf594-130c-45ac-a39e-0070ebe26124' // Pro Plan
        }
        return '/pricing'
    }

    const getCreditLimit = (plan: string) => {
        switch (plan) {
            case 'free':
                return 10
            case 'standard':
                return 200
            case 'pro':
                return 500
            default:
                return 10
        }
    }

    if (!user) {
        return null
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Credit Status
                </CardTitle>
                <CardDescription>
                    Your current plan and available credits
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {status.loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : status.error ? (
                    <div className="text-red-600 text-sm">
                        Error: {status.error}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Plan:</span>
                            <Badge className={getPlanColor(status.plan)}>
                                {getPlanName(status.plan)}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Credits:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-purple-600">
                                    {status.credits}
                                </span>
                                <span className="text-sm text-gray-500">
                                    / {getCreditLimit(status.plan)}
                                </span>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.min((status.credits / getCreditLimit(status.plan)) * 100, 100)}%`
                                }}
                            />
                        </div>

                        {status.credits <= 5 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">
                                        {status.credits === 0 ? 'No credits remaining' : 'Low credits'}
                                    </span>
                                </div>
                                <p className="text-sm text-yellow-700 mt-1">
                                    {status.credits === 0
                                        ? 'Upgrade your plan to continue generating screens.'
                                        : 'Consider upgrading to get more credits.'
                                    }
                                </p>
                            </div>
                        )}

                        {status.plan !== 'pro' && (
                            <Button
                                asChild
                                className="w-full"
                                variant={status.credits === 0 ? "default" : "outline"}
                            >
                                <a href={getUpgradeUrl(status.plan)}>
                                    <ArrowUp className="h-4 w-4 mr-2" />
                                    {status.plan === 'free' ? 'Upgrade to Standard' : 'Upgrade to Pro'}
                                </a>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchCreditStatus}
                            className="w-full"
                        >
                            Refresh Status
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
} 