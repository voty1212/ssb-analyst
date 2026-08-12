import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Landing from './routes/Landing/Landing.jsx'
import NewsAnalyst from './routes/NewsAnalyst/NewsAnalyst.jsx'
import TatAnalysis from './routes/TatAnalysis/TatAnalysis.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/news" element={<NewsAnalyst />} />
        <Route path="/tat" element={<TatAnalysis />} />
      </Routes>
    </div>
  )
}

export default App
