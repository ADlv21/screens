import React, { useRef, useState, useCallback, useEffect } from 'react';

interface FullScreenWhiteboardProps {
    iframeUrl: string;
    title: string;
    onClose: () => void;
}

const FullScreenWhiteboard: React.FC<FullScreenWhiteboardProps> = ({
    iframeUrl,
    title,
    onClose
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
        const newScale = Math.max(0.1, Math.min(10, scale * delta));

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

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white bg-opacity-95 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setScale(prev => Math.min(10, prev * 1.2))}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="Zoom In"
                        >
                            Zoom In
                        </button>
                        <button
                            onClick={() => setScale(prev => Math.max(0.1, prev * 0.8))}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="Zoom Out"
                        >
                            Zoom Out
                        </button>
                        <button
                            onClick={resetView}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            title="Reset View"
                        >
                            Reset
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden bg-gray-100"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Whiteboard background grid */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px'
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
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <iframe
                        src={iframeUrl}
                        onLoad={handleIframeLoad}
                        style={{
                            width: '800px',
                            height: '600px',
                            border: 'none',
                            borderRadius: '1rem',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            backgroundColor: 'white'
                        }}
                        allowFullScreen
                    />
                </div>

                {/* Loading indicator */}
                {!isIframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <p className="text-lg text-gray-600">Loading content...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white bg-opacity-95 shadow-lg">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Scale: {Math.round(scale * 100)}%</span>
                    </div>
                    <div>
                        <p>Mouse wheel to zoom • Drag to pan • Press ESC to close</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenWhiteboard; 