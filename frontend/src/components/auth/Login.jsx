import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getCurrentUser } from '../../api/auth'
import './Login.css'
import logo from '../../assets/Cloud_One_Logo__vector___1_-removebg-preview.png'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getRedirectPath = () => {
    const user = getCurrentUser()
    if (!user) return '/login'
    
    switch (user.role) {
      case 'admin':
        return '/companies'
      case 'user':
        return '/companies'
      default:
        return '/login'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData)
      navigate(getRedirectPath())
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="login-logo" />
        </div>
        <h2 className="login-title">Sign in to your account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <div className="error-text">{error}</div>
            </div>
          )}
          <div className="form-group">
            <input
              id="username"
              name="username"
              type="text"
              required
              className="form-input"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Sign in
          </button>
          <div className="register-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 