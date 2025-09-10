import Header from './components/Header'
import Footer from './components/Footer'
import RoutesView from './routes'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RoutesView />
      </main>
      <Footer />
    </div>
  )
}
