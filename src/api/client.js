import axios from 'axios'

// Backend is on the same remote machine as frontend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add request interceptor
apiClient.interceptors.request.use(config => {
  console.log('Making request to:', config.url)
  return config
})

// Add response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log('Received response from:', response.config.url)
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
    console.error('API Error:', errorData)

    let userMessage = 'Network error occurred'
    if (error.response) {
      userMessage = error.response.data?.message || `Server error (${error.response.status})`
    } else if (error.request) {
      userMessage = 'No response from server'
    }

    return Promise.reject({
      ...error,
      userMessage,
      errorData
    })
  }
)

export default apiClient
