import { Button } from '@/components/ui/button'
import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import { PromptInput } from '@/components/prompt-input'
import {
    Plus,
    FolderOpen,
    Sparkles,
    BarChart3,
    Clock,
    Download,
    Settings,
} from 'lucide-react'
import { useState } from 'react'

const Dashboard = () => {
    const [isGenerating, setIsGenerating] = useState(false)

    const handlePromptSubmit = async (prompt: string) => {
        setIsGenerating(true)
        try {
            // TODO: Implement AI generation logic here
            console.log('Generating UI for prompt:', prompt)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // TODO: Handle the generated UI response
        } catch (error) {
            console.error('Error generating UI:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <AuthenticatedNavbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Prompt Input Component */}
                    <PromptInput
                        onSubmit={handlePromptSubmit}
                        isLoading={isGenerating}
                    />

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <FolderOpen className="h-6 w-6" />
                            <span>My Projects</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <BarChart3 className="h-6 w-6" />
                            <span>Usage Stats</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <Settings className="h-6 w-6" />
                            <span>Settings</span>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard;