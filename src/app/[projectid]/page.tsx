'use client';

import React, { use, useCallback, useEffect } from 'react';
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
//import '@xyflow/react/dist/style.css';

import data from '@/assets/data.json';

// Define the data structure for mobile UI nodes
interface MobileUIData {
    title: string;
    url: string;
}

// Custom node component for mobile UI screens
const MobileUINode = ({ data }: { data: MobileUIData }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {data.title}
                </h3>
            </div>
            <div className="w-[414px] h-[896px] bg-white">
                <iframe
                    src={data.url}
                    className="w-full h-full border-0"
                    title={data.title}
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
};

// Define custom node types
const nodeTypes: NodeTypes = {
    mobileUI: MobileUINode,
};

const ProjectPage = ({ params }: { params: Promise<{ projectid: string }> }) => {
    const { projectid } = use(params);
    console.log(projectid);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Initialize nodes from data
    useEffect(() => {
        const initialNodes: Node[] = data.map((item, index) => ({
            id: item.id,
            type: 'mobileUI',
            position: { x: index * 512, y: index * 0 },
            data: {
                title: item.data.title,
                url: item.data.url,
            },
        }));

        // Create edges connecting nodes in sequence
        const initialEdges: Edge[] = data.slice(1).map((item, index) => ({
            id: `e${index}`,
            source: data[index].id,
            target: item.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
        }));

        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

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
                    attributionPosition="bottom-left"
                >
                    <Background
                        color="#f3f4f6"
                        variant={BackgroundVariant.Dots}
                        gap={10}
                    />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

export default ProjectPage;