import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCompanies, deleteCompany } from '../api/companies'
import Toast from './Toast'

export default function CompaniesList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState({
    businessType: '',
    industry: '',
    country: ''
  })
  const [filterOptions, setFilterOptions] = useState({
    businessTypes: [],
    industries: [],
    countries: ['kenya', 'uganda', 'tanzania'] // These are fixed
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log('Fetching companies...') // Debug log
        const data = await getCompanies()
        console.log('Companies data:', data) // Debug log
        setCompanies(data)
        
        // Extract unique business types and industries
        const businessTypes = [...new Set(data.map(c => c.business_type))].filter(Boolean)
        const industries = [...new Set(data.map(c => c.industry))].filter(Boolean)
        
        setFilterOptions(prev => ({
          ...prev,
          businessTypes,
          industries
        }))
      } catch (error) {
        console.error('Error fetching companies:', error)
        setToast({ 
          message: (
            <div>
              <p>{error.userMessage || 'Failed to load companies'}</p>
              <button 
                onClick={() => {
                  setToast(null)
                  fetchCompanies()
                }}
                className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
              >
                Retry
              </button>
            </div>
          ),
          type: 'error',
          duration: 10000
        })
        setCompanies([]) // Ensure empty state if error occurs
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Fetching company data from database...</p>
    </div>
  )

  if (!Array.isArray(companies) || companies.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">No companies found</h2>
        <p className="text-gray-500 mt-2">
          {companies === null ? 
            'Failed to load companies. Check console for errors.' : 
            'No companies available. Try adding one!'}
        </p>
      </div>
    )
  }

  const filteredCompanies = companies.filter(company => {
    // Business Type Filter
    if (filters.businessType && company.business_type !== filters.businessType) {
      return false
    }
    
    // Industry Filter
    if (filters.industry && company.industry !== filters.industry) {
      return false
    }
    
    // Country Presence Filter
    if (filters.country && !company[`presence_in_${filters.country}`]) {
      return false
    }
    
    return true
  })

  const companyList = filteredCompanies

  return (
    <div className="relative">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
      {/* Filter Controls Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Filter Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Business Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={filters.businessType}
              onChange={(e) => setFilters({...filters, businessType: e.target.value})}
            >
              <option value="">All Types</option>
              {filterOptions.businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
            >
              <option value="">All Industries</option>
              {filterOptions.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Country Presence Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Presence</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
            >
              <option value="">All Countries</option>
              {filterOptions.countries.map(country => (
                <option key={country} value={country}>
                  {country.charAt(0).toUpperCase() + country.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6" key={companies.length}>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Companies</h1>
          <button 
            onClick={async () => {
              setLoading(true)
              try {
                const data = await getCompanies()
                setCompanies(data)
              } catch (error) {
                console.error('Error refreshing data:', error)
              } finally {
                setLoading(false)
              }
            }}
            className="p-2 text-gray-500 hover:text-blue-500"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M21.5 22A10 10 0 0 0 12 12a10 10 0 0 0-9.5 10M2.5 2a10 10 0 0 0 9.5 10 10 10 0 0 0 9.5-10"/>
            </svg>
          </button>
        </div>
      </div>
      {companyList.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 text-center">
          No companies found
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyList.map((company) => (
              <tr key={company.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div>{company.company_name}</div>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.business_type}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.industry}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{company.responsible_person}</div>
                  <div>{company.phone_number}</div>
                  <div>{company.company_email}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    {company.presence_in_kenya && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Kenya</span>}
                    {company.presence_in_uganda && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Uganda</span>}
                    {company.presence_in_tanzania && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Tanzania</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/companies/${company.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this company?')) {
                        await deleteCompany(company.id)
                        const updatedCompanies = await getCompanies()
                        setCompanies(updatedCompanies)
                        setToast({ message: 'Company deleted successfully', type: 'success' })
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
