import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CompaniesList from './components/CompaniesList'
import CompanyForm from './components/CompanyForm'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CompaniesList />} />
            <Route path="/companies/new" element={<CompanyForm />} />
            <Route path="/companies/:id/edit" element={<CompanyForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
