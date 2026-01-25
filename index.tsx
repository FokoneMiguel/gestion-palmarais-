
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Impossible de trouver l'élément root");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Service Worker pour le mode hors-ligne
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW enregistré avec succès');
    }).catch(error => {
      console.log('Échec de l\'enregistrement du SW:', error);
    });
  });
}
