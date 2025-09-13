// src/components/Toaster.jsx
import { Toaster as HotToaster, toast } from 'react-hot-toast'

/**
 * Componente global de toasts + helpers.
 * Colócalo una sola vez (ej. en RootLayout).
 */
export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        className:
          'bg-white/95 backdrop-blur border border-zinc-200 text-zinc-800 rounded-xl shadow-md',
        style: { padding: '10px 12px' },
        success: {
          iconTheme: { primary: '#059669', secondary: '#ffffff' }, // emerald-600
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#ffffff' }, // red-600
        },
      }}
    />
  )
}

/** Helpers opcionales para usar en cualquier parte */
export const notify = {
  success: (msg, opts) => toast.success(msg, opts),
  error: (msg, opts) => toast.error(msg, opts),
  info: (msg, opts) => toast(msg, opts),
  loading: (msg, opts) => toast.loading(msg, opts), // devuelve id
  promise: (promise, messages, opts) =>
    toast.promise(
      promise,
      {
        loading: messages?.loading || 'Procesando…',
        success: messages?.success || 'Listo ✅',
        error: messages?.error || 'Algo salió mal',
      },
      opts
    ),
  dismiss: (id) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
}
