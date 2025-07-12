'use client';

import React, { useEffect, useState } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeTypes,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';

interface MobileUIData {
    title: string;
    url: string;
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

const nodeTypes: NodeTypes = {
    mobileUI: MobileUINode,
};

const ProjectFlow = ({ htmlUrl }: { htmlUrl: string | null }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    console.log('htmlUrl', htmlUrl);

    useEffect(() => {
        if (!htmlUrl) return;

        // You can expand this to multiple nodes if needed
        const initialNodes: Node[] = [
            {
                id: '1',
                type: 'mobileUI',
                position: { x: 0, y: 0 },
                data: {
                    title: 'Generated Mobile UI',
                    url: htmlUrl,
                },
            },
        ];

        setNodes(initialNodes);
        setEdges([]); // No edges for a single node
    }, [htmlUrl, setNodes, setEdges]);

    const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

    return (
        <div className="w-full h-screen bg-gray-50">
            <div className="h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
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
        </div>
    );
};

export default ProjectFlow;
