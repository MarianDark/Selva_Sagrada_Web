import { Link } from 'react-router-dom'
export default function Home(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Selva Sagrada</h1>
      <p className="text-zinc-600 mb-6">Terapias holísticas para tu bienestar.</p>
      <Link to="/reservas" className="inline-block px-6 py-3 rounded-lg bg-black text-white">
        Reserva ahora
      </Link>
    </section>
  )
}
