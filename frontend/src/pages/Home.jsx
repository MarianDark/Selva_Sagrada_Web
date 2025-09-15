import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  // Autoplay robusto (maneja bloqueo silencioso)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    playing ? v.pause() : v.play()
    setPlaying((p) => !p)
  }

  return (
    <main className="bg-white">
      {/* HERO con video (sin poster) */}
      <section className="relative w-full h-[85svh] md:h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Velo suave para legibilidad */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent"
          aria-hidden="true"
        />

        {/* Contenido */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white text-center md:text-left">
            <p className="uppercase tracking-wider text-white/90 text-xs md:text-sm mb-2">
              Selva Sagrada
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight drop-shadow">
              Sanación y bienestar en armonía con la naturaleza
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/95">
              Terapias holísticas y sesiones personalizadas para reconectar contigo. Reserva de forma fácil y rápida.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link to="/reservas" className="btn-primary">
                Reservar ahora
              </Link>
              <a
                href="#beneficios"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/70 text-white hover:bg-white/10 transition"
              >
                Explorar terapias
              </a>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/95 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2">✅ Atención personalizada</span>
              <span className="inline-flex items-center gap-2">✅ Reserva online fácil</span>
              <span className="inline-flex items-center gap-2">✅ Enfoque integral</span>
            </div>
          </div>
        </div>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-white/90 text-jungle-900 shadow-lg hover:bg-white transition"
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
        >
          {playing ? (
            // icono pausa
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 19H7V5h3v14zm7-14h-3v14h3V5z" />
            </svg>
          ) : (
            // icono play
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Sanación energética', desc: 'Equilibra tu energía y reduce el estrés.' },
          { title: 'Meditación guiada', desc: 'Vuelve al presente con prácticas simples.' },
          { title: 'Retiros conscientes', desc: 'Experiencias transformadoras en la naturaleza.' },
        ].map((s) => (
          <article key={s.title} className="card p-6">
            <h3 className="font-medium text-jungle-800">{s.title}</h3>
            <p className="text-sm text-zinc-600 mt-1">{s.desc}</p>
          </article>
        ))}
      </section>

      {/* CTA Reservas */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="card p-6 md:p-10 text-center bg-gradient-to-br from-white to-jungle-50/60">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-jungle-900">
            Agenda tu momento
          </h2>
          <p className="text-zinc-700 mt-2">Calendario claro, confirmación al instante.</p>
          <Link to="/reservas" className="btn-primary mt-6">
            Ver disponibilidad
          </Link>
        </div>
      </section>
    </main>
  )
}
