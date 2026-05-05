import React from 'react';

/**
 * Top-level ErrorBoundary that lives in main.jsx — completely isolated from App.jsx.
 * Even if App.jsx has a runtime crash, this will always show a recovery UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[AppCrash]', error, info?.componentStack);
    this.setState({ componentStack: info?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Unknown error';
      const stack = this.state.componentStack || '';

      return (
        <div style={{
          position: 'fixed', inset: 0,
          background: '#000000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', fontFamily: 'system-ui, sans-serif', zIndex: 99999
        }}>
          <div style={{
            maxWidth: 520, width: '100%',
            background: '#0a0a0a',
            borderRadius: 28, padding: '3rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 80px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              width: 72, height: 72,
              background: 'rgba(239,68,68,0.1)',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2rem',
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <span style={{ fontSize: 32 }}>⚠️</span>
            </div>

            <h2 style={{ color: '#f8fafc', fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>
              Render Crash Detected
            </h2>

            <p style={{ color: '#8696a0', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              The application encountered a critical error and stopped. Your data is safe — this is a display-only failure.
            </p>

            <div style={{
              background: '#000000', borderRadius: 12,
              padding: '1rem', marginBottom: 24, border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left', maxHeight: 120, overflowY: 'auto'
            }}>
              <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {msg}
              </p>
              {stack && (
                <p style={{ color: '#475569', fontSize: 10, marginTop: 8, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {stack.slice(0, 400)}…
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  flex: 1, padding: '14px 24px',
                  background: '#0EA5A4', color: '#000000',
                  borderRadius: 14, border: 'none',
                  fontWeight: 900, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: 'pointer'
                }}
              >
                🔄 Reload App
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, componentStack: null })}
                style={{
                  flex: 1, padding: '14px 24px',
                  background: 'rgba(255,255,255,0.05)', color: '#8696a0',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
                  fontWeight: 700, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: 'pointer'
                }}
              >
                ↩ Try Recover
              </button>
            </div>

            <p style={{ marginTop: 24, fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Open DevTools Console (F12) for full stack trace
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
