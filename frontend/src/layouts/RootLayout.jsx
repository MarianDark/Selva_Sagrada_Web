// src/layouts/RootLayout.jsx
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import AddToHomeBanner from '@/components/AddToHomeBanner.jsx'
import ErrorBoundary from '@/components/ErrorBoundary.jsx'
import FloatingButtons from '@/components/FloatingButtons.jsx'
import Toaster from '@/components/Toaster.jsx'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[image:var(--bg-grad)] text-zinc-800">
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingButtons />
        <AddToHomeBanner />
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}
