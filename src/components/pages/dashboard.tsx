import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import { PromptInput } from '@/components/prompt-input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })
            if (!res.ok) {
                let errorMsg = 'Failed to generate UI';
                try {
                    const data = await res.json();
                    if (data && data.error) errorMsg = data.error + (data.details ? `: ${data.details}` : '');
                } catch (e) {
                    // ignore JSON parse error
                }
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            if (user) await fetchProjects(user.id)
        } catch (error) {
            console.error('Error generating UI:', error)
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
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
                        </div>
                        {loading && <div>Loading projects...</div>}
                        {error && <div className="text-red-500">{error}</div>}
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