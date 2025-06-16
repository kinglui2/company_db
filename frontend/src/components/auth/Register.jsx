import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/auth'
import logo from '../../assets/Cloud_One_Logo__vector___1_-removebg-preview.png'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'viewer' // Default role
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Basic validation
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      await register(formData)
      navigate('/companies')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="register-logo" />
        </div>
        <h2 className="register-title">Create your account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
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
              minLength={3}
              maxLength={50}
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
              minLength={6}
            />
          </div>
          <div className="form-group">
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 