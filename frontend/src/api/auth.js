import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Add token to requests if it exists
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', credentials)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { token, user }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { token, user }
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (!token || !user) return false
  
  try {
    // Basic token validation - check if it's a valid JWT
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) return false
    
    // Check if user data is valid JSON
    JSON.parse(user)
    
    return true
  } catch (error) {
    // If any validation fails, clear the invalid data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

export const hasRole = (role) => {
  const user = getCurrentUser()
  return user?.role === role
}

export default apiClient 