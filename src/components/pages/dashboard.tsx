import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PromptInput } from '@/components/prompt-input'
import { useAuth } from '@/components/auth/auth-provider'
import { generateUIComponent } from '@/lib/actions/generate-ui'
import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, CreditCard, Zap } from 'lucide-react'

interface Project {
    id: string
    name: string
    description: string | null
    created_at: string
    updated_at: string
}

const Dashboard = () => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
    const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null)
    const { user } = useAuth()
    const router = useRouter()

    // Refactored fetchProjects function
    const fetchProjects = async (userId: string) => {
        setLoading(true)
        setError(null)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('projects')
                .select('id, name, description, created_at, updated_at')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
            if (error) throw error
            setProjects(data || [])
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchProjects(user.id)
        }
    }, [user])

    const handlePromptSubmit = async (prompt: string) => {
        setIsGenerating(true)
        setError(null)
        setUpgradeUrl(null)
        try {
            const result = await generateUIComponent(prompt)

            if (result.success) {
                if (user) await fetchProjects(user.id)
                setCreditsRemaining(result.creditsRemaining || null)
                if (result.projectId) {
                    router.push(`/project/${result.projectId}`)
                }
            } else {
                setError(result.error || 'Failed to generate UI')
                setCreditsRemaining(result.creditsRemaining || null)
                setUpgradeUrl(result.upgradeUrl || null)
            }
        } catch (error) {
            console.error('Error generating UI:', error)
            setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <AuthenticatedNavbar>
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Prompt Input Component */}
                        <PromptInput
                            onSubmit={handlePromptSubmit}
                            isLoading={isGenerating}
                        />

                        {/* Subscription Status & Credits */}
                        <Card className="border-2 border-primary/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Subscription Status</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {creditsRemaining !== null && (
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
                                            {creditsRemaining === null
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
                                        {(creditsRemaining === null || creditsRemaining === 0 || upgradeUrl) && (
                                            <Button
                                                size="sm"
                                                onClick={() => window.location.href = upgradeUrl || '/api/checkout?product_id=410368fd-96de-4dfb-9640-a9ada2eac149'}
                                                className="flex items-center gap-1"
                                            >
                                                <Crown className="h-4 w-4" />
                                                {creditsRemaining === null ? 'Subscribe Now' : 'Upgrade Plan'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Display with Upgrade Option */}
                        {error && (
                            <Card className="border-destructive">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="text-destructive">{error}</div>
                                        {upgradeUrl && (
                                            <Button
                                                onClick={() => window.location.href = upgradeUrl}
                                                className="flex items-center gap-1"
                                            >
                                                <Crown className="h-4 w-4" />
                                                Upgrade Now
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
                        </div>
                        {loading && <div>Loading projects...</div>}
                        {error && !upgradeUrl && <div className="text-red-500">{error}</div>}
                        {!loading && !error && projects.length === 0 && (
                            <div className="text-muted-foreground">No projects found. Start by generating one!</div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <Link href={`/project/${project.id}`}>
                                        <CardHeader>
                                            <CardTitle>{project.name}</CardTitle>
                                            {project.description && (
                                                <CardDescription>{project.description}</CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-xs text-muted-foreground">
                                                Last updated: {new Date(project.updated_at).toLocaleString()}
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </AuthenticatedNavbar>
        </div>
    )
}

export default Dashboard;