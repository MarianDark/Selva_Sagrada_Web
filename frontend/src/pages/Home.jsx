import { Link } from 'react-router-dom'


export default function Home(){
return (
<>
{/* HERO */}
<section className="relative overflow-hidden">
<div className="absolute inset-0 -z-10">
{/* vídeo local o remoto: usa poster si lo necesitas */}
<video className="w-full h-full object-cover" autoPlay loop muted playsInline poster="/poster.jpg">
<source src="/hero.mp4" type="video/mp4" />
</video>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-jungle-900/40 to-transparent" />
</div>


<div className="max-w-6xl mx-auto px-4 py-24 md:py-36 text-center text-white">
<h1 className="font-display text-4xl md:text-6xl font-bold drop-shadow">Selva Sagrada</h1>
<p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
Terapias holísticas, conexión y bienestar. Un espacio para volver a ti.
</p>
<div className="mt-8 flex items-center justify-center gap-4">
<Link to="/reservas" className="btn-ghost">Reservar ahora</Link>
<a href="#beneficios" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-jungle-800 hover:bg-zinc-100 transition">Conocer más</a>
</div>
</div>
</section>


{/* BENEFICIOS / SERVICIOS DESTACADOS */}
<section id="beneficios" className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
{[
{title:'Sanación energética', desc:'Equilibra tu energía y reduce el estrés.'},
{title:'Meditación guiada', desc:'Vuelve al presente con prácticas simples.'},
{title:'Retiros conscientes', desc:'Experiencias transformadoras en la naturaleza.'},
].map((s)=> (
<article key={s.title} className="card p-6">
<h3 className="font-medium text-jungle-800">{s.title}</h3>
<p className="text-sm text-zinc-600 mt-1">{s.desc}</p>
</article>
))}
</section>


{/* CTA a reservas con mini calendario ilustrativo (estático) */}
<section className="max-w-6xl mx-auto px-4 pb-20">
<div className="card p-6 md:p-10 text-center bg-gradient-to-br from-white/80 to-jungle-50">
<h2 className="font-display text-2xl md:text-3xl font-semibold text-jungle-900">Agenda tu momento</h2>
<p className="text-zinc-700 mt-2">Calendario claro, confirmación al instante.</p>
<Link to="/reservas" className="btn-primary mt-6">Ver disponibilidad</Link>
</div>
</section>
</>
)
}