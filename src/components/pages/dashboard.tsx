import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import { PromptInput } from '@/components/prompt-input'
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
            <AuthenticatedNavbar>
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Prompt Input Component */}
                        <PromptInput
                            onSubmit={handlePromptSubmit}
                            isLoading={isGenerating}
                        />
                    </div>
                </main>
            </AuthenticatedNavbar>
        </div>
    )
}

export default Dashboard;