import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

const colors = ['#fff9c4', '#c8e6c9', '#bbdefb', '#ffcdd2', '#e1bee7'];

const Sticky = ({ id, initialX, initialY, initialColor, onDelete }) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [text, setText] = useState('');
  const [color, setColor] = useState(initialColor);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: '150px',
        height: '150px',
        backgroundColor: color,
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          height: '80%',
          border: 'none',
          resize: 'none',
          backgroundColor: 'transparent',
          color: 'black',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ fontSize: '10px' }}
        >
          {colors.map((c) => (
            <option key={c} value={c} style={{backgroundColor: c}}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={() => onDelete(id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const Whiteboard = () => {
  const [stickies, setStickies] = useState([
    { id: 1, x: 50, y: 50, color: colors[0] },
    { id: 2, x: 200, y: 100, color: colors[1] },
    { id: 3, x: 350, y: 150, color: colors[2] },
  ]);
  const [nextId, setNextId] = useState(4);

  const addSticky = () => {
    setStickies([...stickies, { id: nextId, x: 50, y: 50, color: colors[0] }]);
    setNextId(nextId + 1);
  };

  const deleteSticky = (id) => {
    setStickies(stickies.filter(sticky => sticky.id !== id));
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
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
        onClick={addSticky}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        付箋を追加
      </button>
    </div>
  );
};

export default Whiteboard;
