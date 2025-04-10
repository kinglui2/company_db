import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom'
import { getCompanies, deleteCompany } from '../api/companies'
import Toast from './Toast'
import '../styles/CompaniesList.css'

const CompaniesList = forwardRef((props, ref) => {
  const [activeCountries, setActiveCountries] = useState({});
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
    countries: ['kenya', 'uganda', 'tanzania', 'rwanda']
  })
  const [customFilters, setCustomFilters] = useState({
    businessType: '',
    industry: ''
  })

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const data = await getCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    handleRefresh
  }))

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log('Fetching companies...')
        const data = await getCompanies()
        console.log('Companies data:', data)
        setCompanies(data)
        
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
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">Fetching company data from database...</p>
      </div>
    )
  }

  if (!Array.isArray(companies) || companies.length === 0) {
    return (
      <div className="empty-state">
        <h2 className="empty-title">No companies found</h2>
        <p className="empty-message">
          {companies === null ? 
            'Failed to load companies. Check console for errors.' : 
            'No companies available. Try adding one!'}
        </p>
      </div>
    )
  }

  const filteredCompanies = companies.filter(company => {
    if (filters.businessType) {
      if (filters.businessType === 'custom') {
        if (!customFilters.businessType || !company.business_type.toLowerCase().includes(customFilters.businessType.toLowerCase())) {
          return false
        }
      } else if (company.business_type !== filters.businessType) {
        return false
      }
    }
    if (filters.industry) {
      if (filters.industry === 'custom') {
        if (!customFilters.industry || !company.industry.toLowerCase().includes(customFilters.industry.toLowerCase())) {
          return false
        }
      } else if (company.industry !== filters.industry) {
        return false
      }
    }
    if (filters.country && !company[`presence_in_${filters.country}`]) {
      return false
    }
    return true
  })

  const handleCountryClick = (companyId, country) => {
    setActiveCountries(prev => {
      const newState = { ...prev };
      const countryKey = country.label.toLowerCase();
      if (newState[companyId] === countryKey) {
        delete newState[companyId];
      } else {
        newState[companyId] = countryKey;
      }
      return newState;
    });
  };

  const handleExport = () => {
    // Show loading state
    setToast({
      message: 'Preparing export...',
      type: 'info',
      duration: 2000
    });

    try {
      // Create a more detailed CSV with proper formatting for Excel
      const headers = [
        'Company Name',
        'Business Type',
        'Industry',
        'Website',
        'Presence',
        'Kenya Contact',
        'Kenya Phone',
        'Kenya Email',
        'Uganda Contact',
        'Uganda Phone',
        'Uganda Email',
        'Tanzania Contact',
        'Tanzania Phone',
        'Tanzania Email',
        'Rwanda Contact',
        'Rwanda Phone',
        'Rwanda Email'
      ];
      
      // Format the data with proper escaping and organization
      const csvData = filteredCompanies.map(company => {
        // Get presence information
        const presence = [
          company.presence_in_kenya ? 'Kenya' : '',
          company.presence_in_uganda ? 'Uganda' : '',
          company.presence_in_tanzania ? 'Tanzania' : '',
          company.presence_in_rwanda ? 'Rwanda' : ''
        ].filter(Boolean).join(', ');
        
        // Get contact information for each country
        const getCountryContacts = (country) => {
          if (!company.countryContacts || !company.countryContacts[country]) {
            return ['', '', ''];
          }
          
          const contact = company.countryContacts[country];
          return [
            contact.responsible_person || '',
            contact.responsible_phone || '',
            contact.responsible_email || ''
          ];
        };
        
        const kenyaContacts = getCountryContacts('kenya');
        const ugandaContacts = getCountryContacts('uganda');
        const tanzaniaContacts = getCountryContacts('tanzania');
        const rwandaContacts = getCountryContacts('rwanda');
        
        // Return formatted row
        return [
          company.company_name,
          company.business_type,
          company.industry,
          company.website || '',
          presence,
          ...kenyaContacts,
          ...ugandaContacts,
          ...tanzaniaContacts,
          ...rwandaContacts
        ];
      });
      
      // Create CSV content with proper escaping
      const escapeCSV = (text) => {
        if (text === null || text === undefined) return '""';
        const string = String(text);
        if (string.includes(',') || string.includes('"') || string.includes('\n')) {
          return `"${string.replace(/"/g, '""')}"`;
        }
        return string;
      };
      
      const csvContent = [
        headers.map(escapeCSV).join(','),
        ...csvData.map(row => row.map(escapeCSV).join(','))
      ].join('\n');
      
      // Add BOM for Excel to recognize UTF-8
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;
      
      // Create and trigger download
      const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with filter information
      const filterInfo = [];
      if (filters.businessType) filterInfo.push(`business_${filters.businessType}`);
      if (filters.industry) filterInfo.push(`industry_${filters.industry}`);
      if (filters.country) filterInfo.push(`country_${filters.country}`);
      
      const filename = `companies_export_${new Date().toISOString().split('T')[0]}${
        filterInfo.length ? `_${filterInfo.join('_')}` : ''
      }.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Show success message
      setToast({
        message: `Successfully exported ${filteredCompanies.length} companies`,
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setToast({
        message: 'Failed to export companies. Please try again.',
        type: 'error',
        duration: 3000
      });
    }
  };

  return (
    <div className="companies-container">
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}

      <div className="filters-card">
        <div className="filter-card">
          <div className="filter-content">
            <h3 className="filter-title">Filter Companies</h3>
            <div className="filter-grid">
              <div className="filter-group">
                <label className="filter-label">Business Type</label>
                <select
                  className="filter-select"
                  value={filters.businessType}
                  onChange={(e) => {
                    setFilters({...filters, businessType: e.target.value})
                    if (e.target.value !== 'custom') {
                      setCustomFilters({...customFilters, businessType: ''})
                    }
                  }}
                >
                  <option value="">All Types</option>
                  {filterOptions.businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="custom">Custom Type...</option>
                </select>
                {filters.businessType === 'custom' && (
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Enter business type..."
                    value={customFilters.businessType}
                    onChange={(e) => setCustomFilters({...customFilters, businessType: e.target.value})}
                  />
                )}
              </div>

              <div className="filter-group">
                <label className="filter-label">Industry</label>
                <select
                  className="filter-select"
                  value={filters.industry}
                  onChange={(e) => {
                    setFilters({...filters, industry: e.target.value})
                    if (e.target.value !== 'custom') {
                      setCustomFilters({...customFilters, industry: ''})
                    }
                  }}
                >
                  <option value="">All Industries</option>
                  {filterOptions.industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                  <option value="custom">Custom Industry...</option>
                </select>
                {filters.industry === 'custom' && (
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Enter industry..."
                    value={customFilters.industry}
                    onChange={(e) => setCustomFilters({...customFilters, industry: e.target.value})}
                  />
                )}
              </div>

              <div className="filter-group">
                <label className="filter-label">Country Presence</label>
                <select
                  className="filter-select"
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
          <button 
            onClick={handleExport}
            className="export-button"
            disabled={filteredCompanies.length === 0}
          >
            <svg className="export-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="table-container">
          <div className="loading-placeholder">
            <div className="placeholder-row"></div>
            {[1,2,3].map(i => (
              <div key={i} className="placeholder-row">
                <div className="placeholder-cell">
                  <div className="placeholder-text w-1/4 mb-3"></div>
                  <div className="placeholder-text w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="table-container empty-state">
          <div className="max-w-sm mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h3 className="empty-title">No companies found</h3>
            <p className="empty-message">
              {companies === null ? 
                'Failed to load companies. Check console for errors.' : 
                'Get started by adding your first company.'}
            </p>
            {companies !== null && (
              <Link to="/companies/new" className="add-button">
                Add Company
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-scroll">
            <table className="companies-table">
              <thead className="table-header">
                <tr>
                  <th className="header-cell">Name</th>
                  <th className="header-cell">Business Type</th>
                  <th className="header-cell">Industry</th>
                  <th className="header-cell">Contact</th>
                  <th className="header-cell">Presence</th>
                  <th className="header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="table-row">
                    <td className="table-cell">
                      <div className="company-name">{company.company_name}</div>
                      {company.website && (
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="company-website"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className="badge badge-gray">
                        {company.business_type}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="badge badge-blue">
                        {company.industry}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="contact-info">
                        {activeCountries[company.id] && company.countryContacts && company.countryContacts[activeCountries[company.id]] ? (
                          <>
                            <div className="contact-name">
                              {company.countryContacts[activeCountries[company.id]].responsible_person}
                            </div>
                            <div className="contact-details">
                              {company.countryContacts[activeCountries[company.id]].responsible_phone && (
                                <div><strong>Phone:</strong> {company.countryContacts[activeCountries[company.id]].responsible_phone}</div>
                              )}
                              {company.countryContacts[activeCountries[company.id]].responsible_email && (
                                <div><strong>Email:</strong> {company.countryContacts[activeCountries[company.id]].responsible_email}</div>
                              )}
                            </div>
                            <div className="contact-details">
                              {company.countryContacts[activeCountries[company.id]].company_phone && (
                                <div><strong>Company Phone:</strong> {company.countryContacts[activeCountries[company.id]].company_phone}</div>
                              )}
                              {company.countryContacts[activeCountries[company.id]].company_email && (
                                <div><strong>Company Email:</strong> {company.countryContacts[activeCountries[company.id]].company_email}</div>
                              )}
                            </div>
                            <div className="country-indicator">
                              Showing contacts for {activeCountries[company.id].charAt(0).toUpperCase() + activeCountries[company.id].slice(1)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="contact-name">Select a country to view contacts</div>
                            <div className="contact-details">
                              Click on a country badge above to view its specific contact information
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="presence-badges">
                        {[
                          {condition: company.presence_in_kenya, label: 'Kenya', style: 'badge-green'},
                          {condition: company.presence_in_uganda, label: 'Uganda', style: 'badge-blue'},
                          {condition: company.presence_in_tanzania, label: 'Tanzania', style: 'badge-yellow'},
                          {condition: company.presence_in_rwanda, label: 'Rwanda', style: 'badge-purple'}
                        ].map((country, index) => (
                          country.condition && (
                            <span 
                              key={index} 
                              className={`badge ${country.style} ${activeCountries[company.id] === country.label.toLowerCase() ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCountryClick(company.id, country);
                              }}
                            >
                              {country.label}
                            </span>
                          )
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <Link
                          to={`/companies/${company.id}/edit`}
                          className="edit-button"
                        >
                          Edit
                        </Link>
                        <button 
                          className="delete-button"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this company?')) {
                              try {
                                await deleteCompany(company.id)
                                const updatedCompanies = await getCompanies()
                                setCompanies(updatedCompanies)
                                setToast({
                                  message: 'Company deleted successfully',
                                  type: 'success'
                                })
                              } catch (error) {
                                console.error('Error deleting company:', error)
                                setToast({
                                  message: 'Failed to delete company',
                                  type: 'error'
                                })
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
})

export default CompaniesList
