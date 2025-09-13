import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar el fallback
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error en un servicio externo
    console.error('[ErrorBoundary]', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Algo salió mal 😢
          </h1>
          <p className="text-zinc-700 mb-4">
            Ocurrió un error inesperado. Puedes intentar recargar la página.
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Recargar
          </button>

          {import.meta.env.DEV && this.state.error && (
            <details className="mt-6 text-left bg-red-50 p-4 rounded-lg text-red-800">
              <summary className="cursor-pointer font-semibold">
                Detalles técnicos
              </summary>
              <pre className="whitespace-pre-wrap text-sm">
                {this.state.error.toString()}
              </pre>
              <pre className="whitespace-pre-wrap text-xs text-red-600">
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
