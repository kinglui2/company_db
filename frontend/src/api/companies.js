import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api';

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
    let userMessage = 'Operation failed';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error.response) {
      errorCode = error.response.status;
      switch(error.response.status) {
        case 400: 
          userMessage = 'Invalid request data';
          break;
        case 401:
          userMessage = 'Please login again';
          break;
        case 404:
          userMessage = 'Resource not found';
          break;
        case 500:
          userMessage = 'Server error - please try again later';
          break;
        default:
          userMessage = error.response.data?.message || `Error occurred (${error.response.status})`;
      }
    } else if (error.request) {
      errorCode = 'NETWORK_ERROR';
      userMessage = 'No response from server - check your connection';
    }

    const errorData = {
      url: error.config?.url,
      status: error.response?.status,
      code: errorCode,
      message: error.message,
      userMessage,
      response: error.response?.data,
      timestamp: new Date().toISOString()
    }
    console.error('❌ API Error:', errorData)

    return Promise.reject({ ...error, ...errorData })
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

export const bulkImportCompanies = async (companies) => {
  try {
    const response = await apiClient.post('/companies/bulk', companies);
    return response.data;
  } catch (error) {
    console.error('Error importing companies:', error);
    throw {
      userMessage: error.response?.data?.error || 'Failed to import companies',
      details: error.response?.data?.details
    };
  }
};

export default apiClient
