import apiClient from './client'

export const getCompany = async (id) => {
  try {
    const response = await apiClient.get(`/companies/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching company', error)
    throw error
  }
}

export const getCompanies = async () => {
  try {
    const response = await apiClient.get('/companies')
    return response.data
  } catch (error) {
    console.error('Error fetching companies', error)
    throw error
  }
}

export const addCompany = async (companyData) => {
  try {
    const response = await apiClient.post('/companies', companyData)
    return response.data
  } catch (error) {
    console.error('Error adding company', error)
    throw error
  }
}

export const updateCompany = async (id, companyData) => {
  try {
    const response = await apiClient.put(`/companies/${id}`, companyData)
    return response.data
  } catch (error) {
    console.error('Error updating company', error)
    throw error
  }
}

export const deleteCompany = async (id) => {
  try {
    const response = await apiClient.delete(`/companies/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting company', error)
    throw error
  }
}
