import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error("Elemento com id 'root' não encontrado no HTML.");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);