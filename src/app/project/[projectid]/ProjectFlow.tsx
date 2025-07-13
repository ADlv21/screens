'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    ReactFlow,
    Node,
    Controls,
    Background,
    useNodesState,
    NodeTypes,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { ProjectScreen } from '@/lib/supabase/getProjectScreens';
import { generateUIComponent } from '@/lib/actions/generate-ui';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';

interface MobileUIData {
    title: string;
    url: string;
}

interface PromptInputData {
    onSubmit: (prompt: string) => void;
    isLoading: boolean;
}

const MobileUINode = ({ data }: { data: MobileUIData }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        if (!data.url) return;
        fetch(data.url)
            .then((res) => res.text())
            .then((html) => setHtmlContent(html))
            .catch(() => setHtmlContent('<p>Failed to load content.</p>'));
    }, [data.url]);

    return (
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {data.title}
                </h3>
            </div>
            <div className="w-[414px] h-[896px] bg-white">
                <iframe
                    src={`data:text/html,${encodeURIComponent(htmlContent)}`}
                    className="w-full h-full border-0"
                    title={data.title}
                    sandbox="allow-scripts"
                />
            </div>
        </div>
    );
};

const PromptInputNode = ({ data }: { data: PromptInputData }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = () => {
        if (prompt.trim() && !data.isLoading) {
            data.onSubmit(prompt.trim());
            setPrompt('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl border-2 border-purple-200 overflow-hidden w-[480px]">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Generate New Screen
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <p className="text-base text-gray-600 font-medium">
                        Describe your new screen
                    </p>
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe a new screen to add to this project... (e.g., 'A user profile page with avatar, name, and settings')"
                        className="text-background resize-none min-h-[160px] text-base leading-relaxed"
                        disabled={data.isLoading}
                    />
                    <p className="text-sm text-gray-500">
                        Press Cmd/Ctrl + Enter to generate
                    </p>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || data.isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 text-lg font-medium"
                >
                    {data.isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Screen
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

const nodeTypes: NodeTypes = {
    mobileUI: MobileUINode,
    promptInput: PromptInputNode,
};

const ProjectFlow = ({ screens, projectId }: { screens: ProjectScreen[]; projectId: string }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerateNewScreen = useCallback(async (prompt: string) => {
        setIsGenerating(true);
        try {
            const result = await generateUIComponent(prompt, projectId);

            if (result.success) {
                // Refresh the page to show the new screen
                router.refresh();
            } else {
                console.error('Failed to generate screen:', result.error);
            }
        } catch (error) {
            console.error('Error generating screen:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [projectId, router]);

    useEffect(() => {
        // Create nodes for each screen
        const screenNodes: Node[] = screens.map((screen, index) => ({
            id: screen.id,
            type: 'mobileUI',
            position: { x: index * 500, y: 0 },
            data: {
                title: screen.name,
                url: screen.htmlUrl,
            },
        }));

        // Add prompt input node on the right side
        const promptNode: Node = {
            id: 'prompt-input',
            type: 'promptInput',
            position: { x: Math.max(screens.length * 500, 600), y: 50 },
            data: {
                onSubmit: handleGenerateNewScreen,
                isLoading: isGenerating,
            },
            draggable: true,
        };

        setNodes([...screenNodes, promptNode]);
    }, [screens, isGenerating, handleGenerateNewScreen, setNodes]);

    return (
        <div className="w-full h-screen bg-gray-50">
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 100 }}
                attributionPosition="bottom-left"
            >
                <Background
                    color="#000000"
                    variant={BackgroundVariant.Dots}
                    gap={30}
                />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default ProjectFlow;
