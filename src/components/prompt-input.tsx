'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptInputProps {
    onSubmit: (prompt: string) => void
    isLoading?: boolean
    disabled?: boolean
    className?: string
}

const EXAMPLE_PROMPTS = [
    "Create a modern login screen for a fitness app with dark theme",
    "Design a food delivery app home screen with restaurant cards",
    "Build a social media profile page with user stats and posts",
    "Create an e-commerce product listing page with filters",
    "Design a weather app dashboard with current conditions",
    "Build a music player interface with album artwork and controls"
]

const MAX_CHARACTERS = 500
const AUTO_SAVE_DELAY = 2000 // 2 seconds

export const PromptInput: React.FC<PromptInputProps> = ({
    onSubmit,
    isLoading = false,
    disabled = false,
    className
}) => {
    const [prompt, setPrompt] = useState('')
    const [characterCount, setCharacterCount] = useState(0)
    const [isValid, setIsValid] = useState(true)
    const [draftSaved, setDraftSaved] = useState(false)
    const [showDraftSaved, setShowDraftSaved] = useState(false)
    const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-save draft functionality
    const saveDraft = useCallback(() => {
        if (prompt.trim()) {
            localStorage.setItem('ai-screens-draft', prompt)
            setDraftSaved(true)
            setShowDraftSaved(true)
            setTimeout(() => setShowDraftSaved(false), 5000)
        }
    }, [prompt])

    // Load draft on component mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('ai-screens-draft')
        if (savedDraft) {
            setPrompt(savedDraft)
            setCharacterCount(savedDraft.length)
        }
    }, [])

    // Auto-save draft with debouncing
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current)
        }

        if (prompt.trim()) {
            autoSaveTimeoutRef.current = setTimeout(saveDraft, AUTO_SAVE_DELAY)
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }
        }
    }, [prompt, saveDraft])

    // Character count and validation
    useEffect(() => {
        const count = prompt.length
        setCharacterCount(count)
        setIsValid(count <= MAX_CHARACTERS && count > 0)
    }, [prompt])

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= MAX_CHARACTERS) {
            setPrompt(value)
        }
    }

    const handleSubmit = () => {
        if (isValid && !isLoading && !disabled) {
            onSubmit(prompt.trim())
            // Clear draft after successful submission
            localStorage.removeItem('ai-screens-draft')
            setDraftSaved(false)
        }
    }

    const handleExampleClick = (examplePrompt: string) => {
        setPrompt(examplePrompt)
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const clearDraft = () => {
        localStorage.removeItem('ai-screens-draft')
        setDraftSaved(false)
    }

    return (
        <Card className={cn("w-full max-w-4xl mx-auto", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Generate Mobile UI
                        </CardTitle>
                        <CardDescription>
                            Describe the mobile app screen you want to create. Be specific about design, functionality, and style.
                        </CardDescription>
                    </div>
                    {draftSaved && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {showDraftSaved ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Draft saved</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Draft saved</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="prompt" className="text-sm font-medium">
                            Your Prompt
                        </label>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className={cn(
                                characterCount > MAX_CHARACTERS ? "text-destructive" : ""
                            )}>
                                {characterCount}/{MAX_CHARACTERS}
                            </span>
                            {!isValid && characterCount > MAX_CHARACTERS && (
                                <div className="flex items-center gap-1 text-destructive">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Too long</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Textarea
                        ref={textareaRef}
                        id="prompt"
                        value={prompt}
                        onChange={handlePromptChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the mobile app screen you want to create... (e.g., 'Create a modern login screen for a fitness app with dark theme and gradient buttons')"
                        className={cn(
                            "min-h-[120px] resize-none",
                            !isValid && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={isLoading || disabled}
                    />
                </div>

                {/* Example Prompts */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Example Prompts</h4>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map((example, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => handleExampleClick(example)}
                            >
                                {example}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Press ⌘+Enter to generate</span>
                        {draftSaved && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearDraft}
                                className="h-auto p-1 text-xs"
                            >
                                Clear draft
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isLoading || disabled || !prompt.trim()}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 