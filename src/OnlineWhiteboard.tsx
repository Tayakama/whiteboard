import React, { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface StickyProps {
  id: string;
  initialX: number;
  initialY: number;
  initialColor: string;
  onDelete: (id: string) => void;
}

const Sticky: React.FC<StickyProps> = ({ id, initialX, initialY, initialColor, onDelete }) => {
  const [position, setPosition] = useState<Position>({ x: initialX, y: initialY });
  const [size, setSize] = useState<Size>({ width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [text, setText] = useState<string>('');
  const [color, setColor] = useState<string>(initialColor);

  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      } else if (isResizing) {
        const newSize = { ...size };
        if (resizeDirection.includes('right')) {
          newSize.width = Math.max(100, e.clientX - position.x);
        }
        if (resizeDirection.includes('bottom')) {
          newSize.height = Math.max(100, e.clientY - position.y);
        }
        if (resizeDirection.includes('left')) {
          const newWidth = Math.max(100, size.width + (position.x - e.clientX));
          newSize.width = newWidth;
          setPosition(prev => ({ ...prev, x: e.clientX }));
        }
        if (resizeDirection.includes('top')) {
          const newHeight = Math.max(100, size.height + (position.y - e.clientY));
          newSize.height = newHeight;
          setPosition(prev => ({ ...prev, y: e.clientY }));
        }
        setSize(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, offset, position, resizeDirection, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (stickyRef.current) {
      const rect = stickyRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsDragging(true);
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeDirection(direction);
    setIsResizing(true);
  };

  return (
    <div
      ref={stickyRef}
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: color,
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
      onMouseDown={handleMouseDown}
    >
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none text-black"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="テキストを入力"
        onMouseDown={(e) => e.stopPropagation()}
      />
      <div className="absolute top-0 right-0 flex" onMouseDown={(e) => e.stopPropagation()}>
        {['red', 'blue', 'green'].map((c) => (
          <button
            key={c}
            className="w-4 h-4 m-1 rounded-full border border-gray-300"
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
        <button onClick={() => onDelete(id)} className="m-1">
          <X size={16} />
        </button>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2 h-full cursor-w-resize" onMouseDown={handleResizeStart('left')} />
        <div className="absolute top-0 right-0 w-2 h-full cursor-e-resize" onMouseDown={handleResizeStart('right')} />
        <div className="absolute top-0 left-0 w-full h-2 cursor-n-resize" onMouseDown={handleResizeStart('top')} />
        <div className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize" onMouseDown={handleResizeStart('bottom')} />
        <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={handleResizeStart('top-left')} />
        <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={handleResizeStart('top-right')} />
        <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={handleResizeStart('bottom-left')} />
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeStart('bottom-right')} />
      </div>
    </div>
  );
};

export default Sticky;
