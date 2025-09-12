import ContactFooterForm from './ContactFooterForm'
export default function Footer(){
return (
<footer id="contacto" className="bg-white/70 backdrop-blur border-t mt-16">
<div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
<div>
<h3 className="text-lg font-semibold mb-2 font-display text-jungle-800">Selva Sagrada</h3>
<p className="text-sm text-zinc-600">Terapias holísticas, bienestar y retiros.</p>
</div>
<div>
<h4 className="font-medium mb-3">Escríbenos</h4>
<ContactFooterForm />
</div>
</div>
<div className="text-center text-xs text-zinc-500 py-4">© {new Date().getFullYear()} Selva Sagrada</div>
</footer>
)
}