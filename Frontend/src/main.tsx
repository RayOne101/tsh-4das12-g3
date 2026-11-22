import { Component, StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './lib/toast'
import './styles/index.css'

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Si une page plante, on affiche un écran d'erreur simple au lieu d'une page blanche.
class ErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', gap: '1rem', fontFamily: 'sans-serif', color: '#333' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Quelque chose s'est mal passé</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Recharge la page pour réessayer.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.6rem 1.4rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Recharger
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
