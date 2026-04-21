import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// ─── Global safety net for unhandled promise rejections ────────────────────
window.addEventListener('unhandledrejection', (event) => {
  console.error('[UnhandledRejection]', event.reason);
});

// ─── Prevent Vite HMR from wiping the page on module errors ────────────────
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (err) => {
    console.error('[ViteHMR Error]', err);
    // Don't let HMR kill the screen — show the error in console only
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
