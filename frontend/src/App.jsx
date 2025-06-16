import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import CompaniesList from './components/CompaniesList'
import CompanyForm from './components/CompanyForm'
import Navbar from './components/Navbar'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import PrivateRoute from './components/auth/PrivateRoute.jsx'
import { isAuthenticated, getCurrentUser } from './api/auth'
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
  const isCompaniesPage = location.pathname === '/companies'
  const isFormPage = location.pathname.includes('/companies/new') || location.pathname.includes('/edit')
  const companiesRef = React.useRef()

  const getRedirectPath = () => {
    const user = getCurrentUser()
    if (!user) return '/login'
    
    switch (user.role) {
      case 'editor':
      case 'viewer':
        return '/companies'
      default:
        return '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated() && !isFormPage && (
        <Navbar 
          onRefresh={() => companiesRef.current?.handleRefresh()} 
          showRefresh={isCompaniesPage}
        />
      )}
      <div className={isCompaniesPage ? '' : `container mx-auto px-4 pb-8 ${isFormPage ? 'pt-0' : 'pt-6'}`}>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? (
                <Navigate to={getRedirectPath()} replace />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated() ? (
                <Navigate to={getRedirectPath()} replace />
              ) : (
                <Register />
              )
            } 
          />

          {/* Protected routes */}
          <Route
            path="/companies"
            element={
              <PrivateRoute>
                <CompaniesList ref={companiesRef} />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/new"
            element={
              <PrivateRoute>
                <CompanyForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/:id/edit"
            element={
              <PrivateRoute>
                <CompanyForm />
              </PrivateRoute>
            }
          />

          {/* Redirect root to login if not authenticated, otherwise to companies */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/companies" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
