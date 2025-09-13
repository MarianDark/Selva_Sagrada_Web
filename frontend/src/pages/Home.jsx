import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden shadow-2xl">
        {/* Video de fondo */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover filter blur-[2px]"
          autoPlay
          loop
          muted
          playsInline
          poster="/poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Capa oscura encima del video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-jungle-900/50 to-transparent" />

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="font-display text-4xl md:text-6xl font-bold drop-shadow-lg">
            Selva Sagrada
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
            Terapias holísticas, conexión y bienestar. Un espacio para volver a ti.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/reservas" className="btn-ghost">
              Reservar ahora
            </Link>
            <a
              href="#beneficios"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-jungle-800 hover:bg-zinc-100 transition"
            >
              Conocer más
            </a>
          </div>
        </div>

        {/* Botón Play/Pause flotante */}
        <button
          onClick={togglePlay}
          className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-white/80 text-jungle-900 shadow-lg hover:bg-white transition"
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
        >
          {playing ? (
            // Icono pausa
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 19H7V5h3v14zm7-14h-3v14h3V5z" />
            </svg>
          ) : (
            // Icono play
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </section>

      {/* BENEFICIOS / SERVICIOS DESTACADOS */}
      <section
        id="beneficios"
        className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Sanación energética',
            desc: 'Equilibra tu energía y reduce el estrés.',
          },
          {
            title: 'Meditación guiada',
            desc: 'Vuelve al presente con prácticas simples.',
          },
          {
            title: 'Retiros conscientes',
            desc: 'Experiencias transformadoras en la naturaleza.',
          },
        ].map((s) => (
          <article key={s.title} className="card p-6">
            <h3 className="font-medium text-jungle-800">{s.title}</h3>
            <p className="text-sm text-zinc-600 mt-1">{s.desc}</p>
          </article>
        ))}
      </section>

      {/* CTA Reservas */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="card p-6 md:p-10 text-center bg-gradient-to-br from-white/80 to-jungle-50">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-jungle-900">
            Agenda tu momento
          </h2>
          <p className="text-zinc-700 mt-2">
            Calendario claro, confirmación al instante.
          </p>
          <Link to="/reservas" className="btn-primary mt-6">
            Ver disponibilidad
          </Link>
        </div>
      </section>
    </>
  )
}
