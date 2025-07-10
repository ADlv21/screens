"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DesignItem {
    key: string;
    url: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface UnifiedWhiteboardProps {
    designs: DesignItem[];
    projectId?: string;
}

const UnifiedWhiteboard: React.FC<UnifiedWhiteboardProps> = ({ designs, projectId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
    const [isDraggingDesign, setIsDraggingDesign] = useState(false);
    const [dragDesignKey, setDragDesignKey] = useState<string | null>(null);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    // Canvas dimensions
    const canvasWidth = 2000;
    const canvasHeight = 1500;

    // Initialize design positions in a grid layout
    const [designPositions, setDesignPositions] = useState<Map<string, { x: number; y: number }>>(() => {
        const positions = new Map();
        designs.forEach((design, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            positions.set(design.key, {
                x: 100 + col * (design.width + 100),
                y: 100 + row * (design.height + 100)
            });
        });
        return positions;
    });

    // Handle canvas zoom with mouse wheel
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(5, scale * delta));

        // Zoom towards mouse position
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            setOffsetX(prev => mouseX - (mouseX - prev) * (newScale / scale));
            setOffsetY(prev => mouseY - (mouseY - prev) * (newScale / scale));
        }

        setScale(newScale);
    }, [scale]);

    // Handle canvas pan
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = (e.clientX - rect.left - offsetX) / scale;
        const mouseY = (e.clientY - rect.top - offsetY) / scale;

        // Check if clicking on a design
        for (const design of designs) {
            const pos = designPositions.get(design.key);
            if (pos &&
                mouseX >= pos.x && mouseX <= pos.x + design.width &&
                mouseY >= pos.y && mouseY <= pos.y + design.height) {
                setSelectedDesign(design.key);
                setIsDraggingDesign(true);
                setDragDesignKey(design.key);
                setDragStartPos({ x: mouseX - pos.x, y: mouseY - pos.y });
                return;
            }
        }

        // If not clicking on a design, start canvas pan
        setIsDragging(true);
        setSelectedDesign(null);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, [designs, designPositions, offsetX, offsetY, scale]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        if (isDraggingDesign && dragDesignKey) {
            // Move the selected design
            const mouseX = (e.clientX - rect.left - offsetX) / scale;
            const mouseY = (e.clientY - rect.top - offsetY) / scale;

            setDesignPositions(prev => {
                const newPositions = new Map(prev);
                newPositions.set(dragDesignKey, {
                    x: mouseX - dragStartPos.x,
                    y: mouseY - dragStartPos.y
                });
                return newPositions;
            });
        } else if (isDragging) {
            // Pan the canvas
            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;

            setOffsetX(prev => prev + deltaX);
            setOffsetY(prev => prev + deltaY);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    }, [isDraggingDesign, isDragging, dragDesignKey, dragStartPos, lastMousePos, offsetX, offsetY, scale]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsDraggingDesign(false);
        setDragDesignKey(null);
    }, []);

    // Render the canvas
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        // Draw whiteboard background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        const gridSize = 50;

        for (let x = 0; x <= canvasWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        for (let y = 0; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }

        // Draw design placeholders (background only)
        designs.forEach(design => {
            const pos = designPositions.get(design.key);
            if (!pos) return;

            const isSelected = selectedDesign === design.key;

            // Draw background
            ctx.fillStyle = isSelected ? '#dbeafe' : '#ffffff';
            ctx.fillRect(pos.x, pos.y, design.width, design.height);

            // Draw border
            ctx.strokeStyle = isSelected ? '#3b82f6' : '#d1d5db';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeRect(pos.x, pos.y, design.width, design.height);

            // Draw title
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(design.name, pos.x + design.width / 2, pos.y + 25);

            // Draw selection indicator
            if (isSelected) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(pos.x - 5, pos.y - 5, design.width + 10, design.height + 10);
                ctx.setLineDash([]);
            }
        });

        ctx.restore();
    }, [designs, designPositions, selectedDesign, offsetX, offsetY, scale]);

    // Render canvas on changes
    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">
                    Unified Whiteboard Canvas
                    {projectId && (
                        <span className="ml-4 text-lg font-normal text-blue-600">[{projectId}]</span>
                    )}
                </h1>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 relative overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        cursor: isDragging ? 'grabbing' : isDraggingDesign ? 'move' : 'grab',
                        display: 'block'
                    }}
                />

                {/* Overlay iframes on top of canvas */}
                {designs.map(design => {
                    const pos = designPositions.get(design.key);
                    if (!pos) return null;

                    return (
                        <div
                            key={design.key}
                            style={{
                                position: 'absolute',
                                top: offsetY + pos.y * scale,
                                left: offsetX + pos.x * scale,
                                width: design.width * scale,
                                height: design.height * scale,
                                pointerEvents: isDraggingDesign ? 'none' : 'auto',
                                zIndex: selectedDesign === design.key ? 10 : 5
                            }}
                        >
                            <iframe
                                src={design.url}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    boxShadow: selectedDesign === design.key
                                        ? '0 0 0 3px #3b82f6'
                                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white'
                                }}
                                allowFullScreen
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UnifiedWhiteboard; 