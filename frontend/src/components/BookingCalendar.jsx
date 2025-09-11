import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { api } from '../lib/api'
import { useEffect, useState } from 'react'


export default function BookingCalendar(){
const [events, setEvents] = useState([])


useEffect(()=>{ // cargar disponibilidad como eventos libres
const from = new Date();
const to = new Date(); to.setMonth(to.getMonth()+2)
api.get('/availability', { params:{ from, to } }).then(({data})=>{
const ev = data.flatMap(d => d.slots.map(s => ({
start: s.start, end: s.end, display: 'background'
})))
setEvents(ev)
})
},[])


const handleSelect = async (info) => {
const name = prompt('Tu nombre para la reserva:')
const email = prompt('Tu email:')
if (!name || !email) return
try {
const { data } = await api.post('/booking', {
name, email, service:'Sesión Holística', start: info.startStr, end: info.endStr,
captchaToken: window.grecaptcha ? await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action:'book' }) : undefined
})
alert('Reserva confirmada: '+ new Date(data.start).toLocaleString())
} catch (e) { alert('No se pudo reservar') }
}


return (
<FullCalendar
plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
initialView="timeGridWeek"
selectable
select={handleSelect}
events={events}
nowIndicator
slotMinTime="08:00:00"
slotMaxTime="21:00:00"
height="auto"
/>
)
}