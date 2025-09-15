import { useEffect, useState } from 'react'

const WA_PHONE = '34600123456' // solo dígitos, sin +

function ChevronUp() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M7.41 15.59 12 11l4.59 4.59L18 14l-6-6-6 6z" />
    </svg>
  )
}

function WhatsIcon() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M19.1 17.6c-.3-.2-1.8-.9-2-1s-.5-.1-.7.2c-.2.3-.8 1-.9 1.1s-.3.2-.6.1a7.5 7.5 0 0 1-2.2-1.4 8.1 8.1 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.7c.2-.2.2-.4 0-.7l-1-2c-.2-.5-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.1 3.1 0 0 0-1 2.3c0 1.4 1 2.8 1.1 3 .1.2 2.2 3.4 5.4 4.7 3.3 1.3 3.3.9 3.9.9s2-.8 2.3-1.6c.2-.8.2-1.5.1-1.6 0-.1-.2-.2-.5-.3Z" />
      <path d="M16 3a13 13 0 0 0-11 19.4L3.4 29 10 27a13 13 0 1 0 6-24Zm7.6 20a10.4 10.4 0 0 1-14.4 1.2l-.3-.2-3.4.9.9-3.3-.2-.4A10.4 10.4 0 1 1 23.6 23Z" />
    </svg>
  )
}

export default function FloatingButtons() {
  const [showUp, setShowUp] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowUp(window.scrollY > 280)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="
        pointer-events-none fixed z-[70]
        right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]
        md:right-6 md:bottom-[max(1.5rem,env(safe-area-inset-bottom))]
        flex flex-col gap-3
      "
    >
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WA_PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp de Selva Sagrada"
        title="WhatsApp"
        className="
          pointer-events-auto h-12 w-12 rounded-full grid place-items-center
          bg-[#25D366] text-white shadow-lg hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]
          transition
        "
      >
        <WhatsIcon />
      </a>

      {/* Scroll up */}
      {showUp && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          title="Volver arriba"
          className="
            pointer-events-auto h-12 w-12 rounded-full grid place-items-center
            bg-white text-jungle-900 shadow-lg border border-jungle-200 hover:bg-jungle-50
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jungle-600
            transition
          "
        >
          <ChevronUp />
        </button>
      )}
    </div>
  )
}
