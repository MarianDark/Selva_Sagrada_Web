// src/components/Loader.jsx
import React from 'react'

/**
 * Loader (spinner) accesible y configurable.
 *
 * Props:
 * - label?: string            → Texto mostrado junto al spinner (default: "Cargando…")
 * - size?: 'sm' | 'md' | 'lg' → Tamaño del spinner (default: 'md')
 * - fullscreen?: boolean      → Ocupa toda la pantalla (default: false)
 * - overlay?: boolean         → Fondo translúcido + blur (default: true si fullscreen)
 * - className?: string        → Clases extra para el contenedor
 */
export default function Loader({
  label = 'Cargando…',
  size = 'md',
  fullscreen = false,
  overlay,
  className = '',
}) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-14 w-14 border-4',
  }
  const spinnerSize = sizes[size] || sizes.md
  const useOverlay = overlay ?? fullscreen

  const wrapperBase = fullscreen
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : 'flex items-center justify-center py-10'

  const wrapperOverlay = useOverlay ? 'bg-white/70 backdrop-blur' : ''

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`${wrapperBase} ${wrapperOverlay} ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`animate-spin rounded-full border-emerald-600 border-t-transparent ${spinnerSize}`}
        />
        {label ? (
          <span className="text-emerald-700 font-medium">{label}</span>
        ) : (
          <span className="sr-only">Cargando…</span>
        )}
      </div>
    </div>
  )
}

/**
 * Skeleton simple (barra/bricks) para cargas de contenido.
 * Úsalo como <Skeleton className="h-6 w-40" />
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/80 ${className}`}
      aria-hidden="true"
    />
  )
}
