'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Crown, CreditCard, Zap, Settings, User } from 'lucide-react'

const SettingsPage = () => {
    const [creditsRemaining, setCreditsRemaining] = useState<number>(0)
    const [plan, setPlan] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (!user?.id) return

        const fetchCreditStatus = async () => {
            try {
                const response = await fetch('/api/user/credit-status')
                if (response.ok) {
                    const data = await response.json()
                    setCreditsRemaining(data.credits)
                    setPlan(data.plan)
                }
            } catch (error) {
                console.error('Error fetching credit status:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCreditStatus()
    }, [user?.id])

    if (!user) {
        return <div>Please log in to access settings.</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <AuthenticatedNavbar>
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center gap-2 mb-8">
                            <Settings className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold">Settings</h1>
                        </div>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <CardTitle>Account Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                        <p className="text-sm font-mono">{user.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="text-sm">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Plan</label>
                                        <p className="text-sm">{plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subscription Status & Credits */}
                        <Card className="border-2 border-primary/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Subscription & Credits</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!loading && creditsRemaining !== null && (
                                            <Badge variant={creditsRemaining > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                                                <Crown className="h-3 w-3" />
                                                {creditsRemaining} credits
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div>
                                        <p className="text-muted-foreground">
                                            {loading
                                                ? "Loading subscription status..."
                                                : creditsRemaining === null
                                                    ? "Subscribe to start generating AI screens"
                                                    : creditsRemaining > 0
                                                        ? `You have ${creditsRemaining} screen generations remaining this month.`
                                                        : "You've used all your credits this month. Upgrade to continue generating screens."
                                            }
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.location.href = '/api/customer-portal'}
                                            className="flex items-center gap-1"
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Manage Subscription
                                        </Button>
                                        {!loading && creditsRemaining === 0 && (
                                            <Button
                                                size="sm"
                                                onClick={() => router.push('/pricing')}
                                                className="flex items-center gap-1"
                                            >
                                                <Crown className="h-4 w-4" />
                                                {creditsRemaining === 0 ? 'Subscribe Now' : 'Upgrade Plan'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Billing & Subscription Management */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <CardTitle>Billing & Subscription</CardTitle>
                                </div>
                                <CardDescription>
                                    Manage your subscription, billing information, and payment methods.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.location.href = '/api/customer-portal'}
                                            className="flex items-center gap-2"
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Customer Portal
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push('/pricing')}
                                            className="flex items-center gap-2"
                                        >
                                            <Crown className="h-4 w-4" />
                                            View Pricing Plans
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Use the customer portal to update your payment method, download invoices, and manage your subscription.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </AuthenticatedNavbar>
        </div>
    )
}

export default SettingsPage