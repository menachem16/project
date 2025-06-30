import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Inject Google Maps API key from environment into gmpx-api-loader
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('gmpx-api-loader');
    if (loader && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      loader.setAttribute('key', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    }
  });
}
