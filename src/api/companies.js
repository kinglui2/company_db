import axios from 'axios'

// Use the ngrok backend URL directly during development for cross-device/frontend-backend testing
const BASE_URL = import.meta.env.PROD
  ? 'https://3a49-102-164-54-1.ngrok-free.app/api' // Production/Ngrok
  : 'http://localhost:5000/api'                    // Local dev

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Log outgoing requests
apiClient.interceptors.request.use(config => {
  console.log(`➡️ Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

// Handle responses and errors globally
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

    let userMessage = 'Network error occurred'
    if (error.response) {
      userMessage = error.response.data?.message || `Server error (${error.response.status})`
    } else if (error.request) {
      userMessage = 'No response from server'
    }

    return Promise.reject({ ...error, userMessage, errorData })
  }
)

// ✅ Company API functions
export const getCompanies = async () => {
  try {
    const response = await apiClient.get('/companies')
    return response.data
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw error
  }
}

export const getCompany = async (id) => {
  try {
    const response = await apiClient.get(`/companies/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching company:', error)
    throw error
  }
}

export const addCompany = async (companyData) => {
  try {
    const response = await apiClient.post('/companies', companyData)
    return response.data
  } catch (error) {
    console.error('Error adding company:', error)
    throw error
  }
}

export const updateCompany = async (id, companyData) => {
  try {
    const response = await apiClient.put(`/companies/${id}`, companyData)
    return response.data
  } catch (error) {
    console.error('Error updating company:', error)
    throw error
  }
}

export const deleteCompany = async (id) => {
  try {
    const response = await apiClient.delete(`/companies/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting company:', error)
    throw error
  }
}

export default apiClient
