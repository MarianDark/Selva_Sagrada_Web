import { useA2HS } from '@/hooks/useA2HS'

export default function AddToHomeBanner() {
  const { showBanner, mode, triggerInstall, dismiss } = useA2HS()

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-md rounded-2xl shadow-lg bg-white/95 backdrop-blur border border-zinc-200">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-zinc-900">Instala Selva Sagrada</h3>
          {mode === 'android' ? (
            <p className="mt-1 text-sm text-zinc-600">
              Añade la app a tu pantalla de inicio para una experiencia más rápida y acceso offline.
            </p>
          ) : (
            <p className="mt-1 text-sm text-zinc-600">
              En iPhone/iPad: toca <span className="font-medium">Compartir</span> 
              (icono de cuadro con flecha) y luego <span className="font-medium">“Añadir a pantalla de inicio”</span>.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {mode === 'android' ? (
              <button
                onClick={triggerInstall}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Instalar
              </button>
            ) : (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Ok, entendido
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
