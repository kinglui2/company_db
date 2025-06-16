import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCurrentUser, hasRole, logout } from '../api/auth'
import './Navbar.css'

const Navbar = ({ onRefresh, showRefresh }) => {
  const location = useLocation()
  const isFormPage = location.pathname.includes('/companies/new') || location.pathname.includes('/edit')
  const user = getCurrentUser()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleBadgeClass = (role) => {
    return role === 'editor' ? 'role-badge editor' : 'role-badge viewer';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link 
            to="/" 
            className="navbar-title"
            onClick={scrollToTop}
          >
            Company DB
          </Link>
          {showRefresh && (
            <button 
              onClick={onRefresh}
              className="refresh-button"
              title="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M21.5 22A10 10 0 0 0 12 12a10 10 0 0 0-9.5 10M2.5 2a10 10 0 0 0 9.5 10 10 10 0 0 0 9.5-10"/>
              </svg>
            </button>
          )}
        </div>
        {!isFormPage && (
          <div className="navbar-right">
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">{user?.username}</span>
                <span className={getRoleBadgeClass(user?.role)}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 