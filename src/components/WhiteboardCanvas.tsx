import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WhiteboardCanvasProps {
    iframeUrl: string;
    title: string;
    width?: number;
    height?: number;
    onFullScreen?: () => void;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
    iframeUrl,
    title,
    width = 400,
    height = 300,
    onFullScreen
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    // Handle zoom with mouse wheel
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(5, scale * delta));

        // Zoom towards mouse position
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            setOffsetX(prev => mouseX - (mouseX - prev) * (newScale / scale));
            setOffsetY(prev => mouseY - (mouseY - prev) * (newScale / scale));
        }

        setScale(newScale);
    }, [scale]);

    // Handle mouse down for dragging
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        setOffsetX(prev => prev + deltaX);
        setOffsetY(prev => prev + deltaY);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, [isDragging, lastMousePos]);

    // Handle mouse up
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle iframe load
    const handleIframeLoad = useCallback(() => {
        setIsIframeLoaded(true);
    }, []);

    // Reset view
    const resetView = useCallback(() => {
        setScale(1);
        setOffsetX(0);
        setOffsetY(0);
    }, []);

    // Zoom in
    const zoomIn = useCallback(() => {
        setScale(prev => Math.min(5, prev * 1.2));
    }, []);

    // Zoom out
    const zoomOut = useCallback(() => {
        setScale(prev => Math.max(0.1, prev * 0.8));
    }, []);

    return (
        <div className="flex flex-col space-y-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={zoomIn}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        title="Zoom In"
                    >
                        +
                    </button>
                    <button
                        onClick={zoomOut}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        title="Zoom Out"
                    >
                        -
                    </button>
                    <button
                        onClick={resetView}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        title="Reset View"
                    >
                        Reset
                    </button>
                    {onFullScreen && (
                        <button
                            onClick={onFullScreen}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            title="Full Screen"
                        >
                            ⛶
                        </button>
                    )}
                </div>
            </div>

            <div
                ref={containerRef}
                className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50"
                style={{ width, height }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Whiteboard background grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Iframe content with transform */}
                <div
                    style={{
                        position: 'absolute',
                        top: offsetY,
                        left: offsetX,
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                        width: width,
                        height: height,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <iframe
                        src={iframeUrl}
                        onLoad={handleIframeLoad}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white'
                        }}
                        allowFullScreen
                    />
                </div>

                {/* Loading indicator */}
                {!isIframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="text-sm text-gray-600">Loading content...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span className="font-medium">Scale: {Math.round(scale * 100)}%</span>
                </div>
                <div className="text-xs">
                    <p>Mouse wheel to zoom • Drag to pan</p>
                </div>
            </div>
        </div>
    );
};

export default WhiteboardCanvas; 