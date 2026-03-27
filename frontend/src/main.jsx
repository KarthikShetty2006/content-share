import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ correct import for React 18
import App from './App';
import './styles/global.css';
import './styles/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ createRoot is from react-dom/client
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
