import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const colors = ['yellow', 'pink', 'blue', 'green', 'purple'];

interface StickyProps {
  id: number;
  initialX: number;
  initialY: number;
  initialColor: string;
  onDelete: (id: number) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface StickyData {
  id: number;
  x: number;
  y: number;
  color: string;
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
  }, [isDragging, isResizing, offset.x, offset.y, position.x, position.y, resizeDirection, size.height, size.width, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === stickyRef.current) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  return (
    <div
      ref={stickyRef}
      className="absolute p-2 rounded shadow cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: color,
      }}
      onMouseDown={handleMouseDown}
    >
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="テキストを入力"
      />
      <div className="absolute top-0 right-0 flex">
        {colors.map((c) => (
          <button
            key={c}
            className="w-4 h-4 m-1 rounded-full"
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

const Whiteboard: React.FC = () => {
  const [stickies, setStickies] = useState<StickyData[]>([]);

  const addSticky = () => {
    const newSticky: StickyData = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setStickies([...stickies, newSticky]);
  };
  
  const deleteSticky = (id: number) => {
    setStickies(stickies.filter(sticky => sticky.id !== id));
  };

  return (
    <div className="relative w-screen h-screen bg-white">
      {stickies.map((sticky) => (
        <Sticky
          key={sticky.id}
          id={sticky.id}
          initialX={sticky.x}
          initialY={sticky.y}
          initialColor={sticky.color}
          onDelete={deleteSticky}
        />
      ))}
      <button
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={addSticky}
      >
        付箋を追加
      </button>
    </div>
  );
};

const OnlineWhiteboard: React.FC = Whiteboard;
export default OnlineWhiteboard;