import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Add request interceptor
apiClient.interceptors.request.use(config => {
  console.log(`➡️ Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

// Add response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log(`✅ Response from: ${response.config.url}`)
    return response
  },
  error => {
    const errorData = {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
      timestamp: new Date().toISOString()
    }
    console.error('❌ API Error:', errorData)

    let userMessage = 'An unexpected error occurred'
    
    if (error.response) {
      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 400:
          userMessage = error.response.data?.message || 'Invalid request'
          break
        case 401:
          userMessage = 'Unauthorized access'
          break
        case 403:
          userMessage = 'Access forbidden'
          break
        case 404:
          userMessage = 'Resource not found'
          break
        case 409:
          userMessage = 'Conflict with existing resource'
          break
        case 422:
          userMessage = error.response.data?.message || 'Validation error'
          break
        case 429:
          userMessage = 'Too many requests'
          break
        case 500:
          userMessage = 'Server error'
          break
        case 503:
          userMessage = 'Service unavailable'
          break
        default:
          userMessage = error.response.data?.message || `Server error (${error.response.status})`
      }
    } else if (error.request) {
      // Network error handling
      if (error.code === 'ECONNABORTED') {
        userMessage = 'Request timed out'
      } else if (!window.navigator.onLine) {
        userMessage = 'No internet connection'
      } else {
        userMessage = 'Unable to reach server'
      }
    }

    return Promise.reject({
      ...error,
      userMessage,
      errorData
    })
  }
)

export default apiClient
