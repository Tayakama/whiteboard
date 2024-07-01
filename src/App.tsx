import React from 'react';
import OnlineWhiteboard from './OnlineWhiteboard';

function App() {
  const handleDelete = (id: string) => {
    console.log(`Sticky note with id ${id} deleted`);
  };

  return (
    <div className="App">
      <OnlineWhiteboard 
        id="1" 
        initialX={100} 
        initialY={100} 
        initialColor="yellow" 
        onDelete={handleDelete} 
      />
    </div>
  );
}

export default App;
