import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';  // この行が正しいことを確認

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);