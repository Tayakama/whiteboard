import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const colors = [
  'rgba(255, 255, 0, 0.3)',  // 薄い黄色
  'rgba(255, 192, 203, 0.3)', // 薄いピンク
  'rgba(173, 216, 230, 0.3)', // 薄い青
  'rgba(144, 238, 144, 0.3)', // 薄い緑
  'rgba(221, 160, 221, 0.3)'  // 薄い紫
];

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface StickyProps {
  id: number;
  initialX: number;
  initialY: number;
  initialColor: string;
  onDelete: (id: number) => void;
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

  // ... (useEffect と他のイベントハンドラは変更なし)

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
        border: '1px solid rgba(0, 0, 0, 0.1)', // 薄い境界線を追加
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
        {colors.map((c) => (
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
      {/* ... (リサイズハンドラは変更なし) */}
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