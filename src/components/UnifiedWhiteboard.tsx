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

const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 812;
const GRID_SIZE = 50; // px, grid square size on screen

const UnifiedWhiteboard: React.FC<UnifiedWhiteboardProps> = ({ designs, projectId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
    const [isDraggingDesign, setIsDraggingDesign] = useState(false);
    const [dragDesignKey, setDragDesignKey] = useState<string | null>(null);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    // Responsive canvas size
    useEffect(() => {
        function updateSize() {
            if (containerRef.current) {
                setCanvasSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Initialize design positions in a grid layout
    const [designPositions, setDesignPositions] = useState<Map<string, { x: number; y: number }>>(() => {
        const positions = new Map();
        designs.forEach((design, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            positions.set(design.key, {
                x: 100 + col * (MOBILE_WIDTH + 100),
                y: 100 + row * (MOBILE_HEIGHT + 100)
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
                mouseX >= pos.x && mouseX <= pos.x + MOBILE_WIDTH &&
                mouseY >= pos.y && mouseY <= pos.y + MOBILE_HEIGHT) {
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

        // Draw grid in screen space (grid squares always same size on screen)
        ctx.save();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        // Calculate grid start based on pan/zoom
        const startX = -((offsetX / scale) % GRID_SIZE) * scale;
        const startY = -((offsetY / scale) % GRID_SIZE) * scale;
        for (let x = startX; x < canvasSize.width; x += GRID_SIZE * scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasSize.height);
            ctx.stroke();
        }
        for (let y = startY; y < canvasSize.height; y += GRID_SIZE * scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasSize.width, y);
            ctx.stroke();
        }
        ctx.restore();

        // Draw design rectangles (background only, in world space)
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        designs.forEach(design => {
            const pos = designPositions.get(design.key);
            if (!pos) return;
            const isSelected = selectedDesign === design.key;
            ctx.fillStyle = isSelected ? '#dbeafe' : '#ffffff';
            ctx.fillRect(pos.x, pos.y, MOBILE_WIDTH, MOBILE_HEIGHT);
            ctx.strokeStyle = isSelected ? '#3b82f6' : '#d1d5db';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeRect(pos.x, pos.y, MOBILE_WIDTH, MOBILE_HEIGHT);
            if (isSelected) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(pos.x - 5, pos.y - 5, MOBILE_WIDTH + 10, MOBILE_HEIGHT + 10);
                ctx.setLineDash([]);
            }
        });
        ctx.restore();
    }, [designs, designPositions, selectedDesign, offsetX, offsetY, scale, canvasSize]);

    // Render canvas on changes
    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header - always fixed, never zoomed */}
            <div className="flex items-center justify-between p-4 bg-white shadow-sm" style={{ position: 'relative', zIndex: 100 }}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Unified Whiteboard Canvas
                    {projectId && (
                        <span className="ml-4 text-lg font-normal text-blue-600">[{projectId}]</span>
                    )}
                </h1>
            </div>

            {/* Canvas Container - only this area is zoomed/panned */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    tabIndex={0}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        cursor: isDragging ? 'grabbing' : isDraggingDesign ? 'move' : 'grab',
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        outline: 'none',
                    }}
                    onFocus={e => e.currentTarget.style.outline = '2px solid #3b82f6'}
                    onBlur={e => e.currentTarget.style.outline = 'none'}
                />
                {/* Overlay iframes and design titles on top of canvas, fixed size, only container is scaled */}
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
                                width: MOBILE_WIDTH,
                                height: MOBILE_HEIGHT,
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                                pointerEvents: isDraggingDesign ? 'none' : 'auto',
                                zIndex: selectedDesign === design.key ? 10 : 5,
                                boxShadow: selectedDesign === design.key
                                    ? '0 0 0 3px #3b82f6'
                                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                                background: '#fff',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Title inside the scaled container */}
                            <div
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: 20,
                                    color: '#22223b',
                                    background: 'rgba(255,255,255,0.95)',
                                    padding: '8px 0 4px 0',
                                    borderTopLeftRadius: '0.5rem',
                                    borderTopRightRadius: '0.5rem',
                                    userSelect: 'none',
                                    zIndex: 2,
                                }}
                            >
                                {design.name}
                            </div>
                            {/* Iframe (fills the rest) */}
                            <iframe
                                src={design.url}
                                width={MOBILE_WIDTH}
                                height={MOBILE_HEIGHT}
                                style={{
                                    width: MOBILE_WIDTH,
                                    height: MOBILE_HEIGHT,
                                    border: 'none',
                                    borderRadius: '0 0 0.5rem 0.5rem',
                                    backgroundColor: 'white',
                                    pointerEvents: isDraggingDesign ? 'none' : 'auto',
                                    display: 'block',
                                    flex: 1,
                                    marginTop: 0,
                                }}
                                allowFullScreen
                                tabIndex={-1}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UnifiedWhiteboard; 