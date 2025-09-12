import { useEffect, useState } from 'react'
import { api } from '../lib/api'


export default function ProtectedRoute({ children, role }) {
const [allowed, setAllowed] = useState(null)
useEffect(() => {
api.get('/health').then(() => setAllowed(true)).catch(() => setAllowed(false))
}, [])
if (allowed === null) return <div className="p-6">Cargando...</div>
if (!allowed) { window.location.href = '/login'; return null }
return children
}