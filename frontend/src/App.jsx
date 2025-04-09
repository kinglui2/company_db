import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import CompaniesList from './components/CompaniesList'
import CompanyForm from './components/CompanyForm'
import Navbar from './components/Navbar'
import React from 'react'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const isCompaniesPage = location.pathname === '/'
  const companiesRef = React.useRef()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onRefresh={() => companiesRef.current?.handleRefresh()} 
        showRefresh={isCompaniesPage}
      />
      <div className="container mx-auto px-4 pb-8 pt-0">
        <Routes>
          <Route path="/" element={<CompaniesList ref={companiesRef} />} />
          <Route path="/companies/new" element={<CompanyForm />} />
          <Route path="/companies/:id/edit" element={<CompanyForm />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
