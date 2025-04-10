import { useState, useEffect } from 'react'
import Toast from './Toast'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompany, addCompany, updateCompany } from '../api/companies'
import '../styles/CompanyForm.css'

export default function CompanyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  
  const countryCode = {
    kenya: '+254',
    uganda: '+256',
    tanzania: '+255',
    rwanda: '+250'
  }

  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      business_type: '',
      industry: '',
      website: '',
      country_contacts: {
        kenya: {
          responsible_person: '',
          responsible_phone: '',
          responsible_email: '',
          company_phone: '',
          company_email: ''
        },
        uganda: {
          responsible_person: '',
          responsible_phone: '',
          responsible_email: '',
          company_phone: '',
          company_email: ''
        },
        tanzania: {
          responsible_person: '',
          responsible_phone: '',
          responsible_email: '',
          company_phone: '',
          company_email: ''
        },
        rwanda: {
          responsible_person: '',
          responsible_phone: '',
          responsible_email: '',
          company_phone: '',
          company_email: ''
        }
      },
      presence_in_kenya: false,
      presence_in_uganda: false,
      presence_in_tanzania: false,
      presence_in_rwanda: false
    }
  })

  // Watch form values for changes
  useEffect(() => {
    const subscription = watch(() => {
      setIsDirty(true)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (isEdit) {
      const fetchCompany = async () => {
        try {
          const company = await getCompany(id)
          // Set basic company info
          setValue('name', company.name)
          setValue('business_type', company.business_type)
          setValue('industry', company.industry)
          setValue('website', company.website)
          
          // Set presence flags
          setValue('presence_in_kenya', company.presence_in_kenya)
          setValue('presence_in_uganda', company.presence_in_uganda)
          setValue('presence_in_tanzania', company.presence_in_tanzania)
          setValue('presence_in_rwanda', company.presence_in_rwanda)
          
          // Set country contacts
          if (company.country_contacts) {
            Object.entries(company.country_contacts).forEach(([country, contacts]) => {
              setValue(`country_contacts.${country}`, contacts)
            })
          }
          
          setIsDirty(false)
        } catch (error) {
          console.error('Error fetching company:', error)
          setToast({
            message: error.userMessage || 'Failed to load company details',
            type: 'error'
          })
        }
      }
      fetchCompany()
    }
  }, [id, isEdit, setValue])

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      
      // Get the selected country for contacts
      const selectedCountry = data.country;
      
      // Prepare the new contact data for the selected country
      const newContactData = {
        [selectedCountry]: {
          responsible_person: data.country_contacts[selectedCountry].responsible_person,
          responsible_phone: data.country_contacts[selectedCountry].responsible_phone,
          responsible_email: data.country_contacts[selectedCountry].responsible_email,
          company_phone: data.country_contacts[selectedCountry].company_phone,
          company_email: data.country_contacts[selectedCountry].company_email
        }
      };

      // Prepare company data with presence flags
      const companyData = {
        company_name: data.name,
        business_type: data.business_type,
        industry: data.industry,
        website: data.website,
        presence_in_kenya: data.presence_in_kenya || false,
        presence_in_uganda: data.presence_in_uganda || false,
        presence_in_tanzania: data.presence_in_tanzania || false,
        presence_in_rwanda: data.presence_in_rwanda || false,
        countryContacts: newContactData
      };

      if (isEdit) {
        // Fetch existing company data to preserve other country contacts
        const existingCompany = await getCompany(id);
        
        // Create a copy of existing contacts or initialize empty object
        const existingContacts = existingCompany.country_contacts || {};
        
        // Merge existing contacts with the new one
        companyData.countryContacts = {
          ...existingContacts,
          ...newContactData
        };

        await updateCompany(id, companyData);
        setToast({
          message: 'Company updated successfully',
          type: 'success'
        });
      } else {
        await addCompany(companyData);
        setToast({
          message: 'Company added successfully',
          type: 'success'
        });
      }
      
      setIsDirty(false);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setToast({
        message: error.userMessage || 'Failed to save company details',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All changes will be lost.')) {
      reset()
      setSelectedCountry(null)
      setIsDirty(false)
    }
  }

  return (
    <div className="form-container">
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}

      <div className="header-container">
        <button
          type="button"
          onClick={() => {
            if (!isDirty || window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
              navigate('/')
            }
          }}
          className="back-button"
        >
          <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} className="form-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Company Name
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('name', { 
                  required: 'Company name is required',
                  minLength: {
                    value: 2,
                    message: 'Company name must be at least 2 characters long'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Company name cannot exceed 100 characters'
                  }
                })}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter company name"
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Business Type
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('business_type', { 
                  required: 'Business type is required',
                  minLength: {
                    value: 2,
                    message: 'Business type must be at least 2 characters long'
                  }
                })}
                className={`form-input ${errors.business_type ? 'error' : ''}`}
                placeholder="e.g., Manufacturing, Retail"
              />
              {errors.business_type && <span className="error-message">{errors.business_type.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Industry
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('industry', { 
                  required: 'Industry is required',
                  minLength: {
                    value: 2,
                    message: 'Industry must be at least 2 characters long'
                  }
                })}
                className={`form-input ${errors.industry ? 'error' : ''}`}
                placeholder="e.g., Technology, Finance"
              />
              {errors.industry && <span className="error-message">{errors.industry.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                {...register('website', {
                  validate: (value) => {
                    if (!value) return true; // Allow empty values
                    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
                    return urlPattern.test(value) || 'Please enter a valid website URL (e.g., https://example.com)';
                  }
                })}
                className={`form-input ${errors.website ? 'error' : ''}`}
                placeholder="https://www.example.com"
              />
              {errors.website && <span className="error-message">{errors.website.message}</span>}
            </div>

            {/* Country Presence Checkboxes */}
            <div className="form-group">
              <label className="form-label">Company Presence</label>
              <div className="form-presence-grid">
                <div className="form-presence-item">
                  <input
                    type="checkbox"
                    {...register('presence_in_kenya')}
                    className="form-checkbox"
                  />
                  <label className="form-presence-label">Kenya</label>
                </div>
                <div className="form-presence-item">
                  <input
                    type="checkbox"
                    {...register('presence_in_uganda')}
                    className="form-checkbox"
                  />
                  <label className="form-presence-label">Uganda</label>
                </div>
                <div className="form-presence-item">
                  <input
                    type="checkbox"
                    {...register('presence_in_tanzania')}
                    className="form-checkbox"
                  />
                  <label className="form-presence-label">Tanzania</label>
                </div>
                <div className="form-presence-item">
                  <input
                    type="checkbox"
                    {...register('presence_in_rwanda')}
                    className="form-checkbox"
                  />
                  <label className="form-presence-label">Rwanda</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Select Country for Contact Details
                <span className="required-mark">*</span>
              </label>
              <select
                {...register('country', { required: 'Country is required' })}
                className={`form-input ${errors.country ? 'error' : ''}`}
                onChange={(e) => {
                  const country = e.target.value;
                  setValue('country', country);
                  setSelectedCountry(country);
                }}
              >
                <option value="">Select a country</option>
                <option value="kenya">Kenya</option>
                <option value="uganda">Uganda</option>
                <option value="tanzania">Tanzania</option>
                <option value="rwanda">Rwanda</option>
              </select>
              {errors.country && <span className="error-message">{errors.country.message}</span>}
            </div>

            {watch('country') && (
              <div className="form-group">
                <label className="form-label">
                  Responsible Person
                  <span className="required-mark">*</span>
                </label>
                <input
                  {...register(`country_contacts.${watch('country')}.responsible_person`, { 
                    required: 'Responsible person is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters long'
                    }
                  })}
                  className={`form-input ${errors.country_contacts?.[watch('country')]?.responsible_person ? 'error' : ''}`}
                  placeholder="Full name of contact person"
                />
                {errors.country_contacts?.[watch('country')]?.responsible_person && (
                  <span className="error-message">{errors.country_contacts[watch('country')].responsible_person.message}</span>
                )}
              </div>
            )}

            {watch('country') && (
              <div className="form-group">
                <label className="form-label">
                  Responsible Person Phone
                  <span className="required-mark">*</span>
                </label>
                <input
                  {...register(`country_contacts.${watch('country')}.responsible_phone`, { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}$/,
                      message: 'Please enter a valid phone number (e.g., +256 414 250 110)'
                    },
                    validate: (value) => {
                      const cleanValue = value.replace(/\s+/g, '');
                      const countryCodeWithoutPlus = countryCode[watch('country')].replace('+', '');
                      
                      // Check country code
                      if (!cleanValue.startsWith(countryCodeWithoutPlus) && !cleanValue.startsWith('+' + countryCodeWithoutPlus)) {
                        return `Phone number must start with ${countryCode[watch('country')]}`;
                      }
                      
                      // Check total length (country code + 9 digits)
                      const numberWithoutCountryCode = cleanValue.replace(/^\+?[0-9]{3}/, '');
                      if (numberWithoutCountryCode.length !== 9) {
                        return 'Phone number must be 9 digits after the country code';
                      }
                      
                      return true;
                    }
                  })}
                  className={`form-input ${errors.country_contacts?.[watch('country')]?.responsible_phone ? 'error' : ''}`}
                  placeholder={`${countryCode[watch('country')]} 414 250 110`}
                />
                {errors.country_contacts?.[watch('country')]?.responsible_phone && (
                  <span className="error-message">{errors.country_contacts[watch('country')].responsible_phone.message}</span>
                )}
              </div>
            )}

            {watch('country') && (
              <div className="form-group">
                <label className="form-label">
                  Responsible Person Email
                  <span className="required-mark">*</span>
                </label>
                <input
                  {...register(`country_contacts.${watch('country')}.responsible_email`, { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className={`form-input ${errors.country_contacts?.[watch('country')]?.responsible_email ? 'error' : ''}`}
                  placeholder={`${watch('country')}.contact@company.com`}
                />
                {errors.country_contacts?.[watch('country')]?.responsible_email && (
                  <span className="error-message">{errors.country_contacts[watch('country')].responsible_email.message}</span>
                )}
              </div>
            )}

            {watch('country') && (
              <div className="form-group">
                <label className="form-label">
                  Company Phone
                  <span className="required-mark">*</span>
                </label>
                <input
                  {...register(`country_contacts.${watch('country')}.company_phone`, { 
                    required: 'Company phone is required',
                    pattern: {
                      value: /^\+?[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}$/,
                      message: 'Please enter a valid phone number (e.g., +256 414 250 110)'
                    },
                    validate: (value) => {
                      const cleanValue = value.replace(/\s+/g, '');
                      const countryCodeWithoutPlus = countryCode[watch('country')].replace('+', '');
                      
                      // Check country code
                      if (!cleanValue.startsWith(countryCodeWithoutPlus) && !cleanValue.startsWith('+' + countryCodeWithoutPlus)) {
                        return `Phone number must start with ${countryCode[watch('country')]}`;
                      }
                      
                      // Check total length (country code + 9 digits)
                      const numberWithoutCountryCode = cleanValue.replace(/^\+?[0-9]{3}/, '');
                      if (numberWithoutCountryCode.length !== 9) {
                        return 'Phone number must be 9 digits after the country code';
                      }
                      
                      return true;
                    }
                  })}
                  className={`form-input ${errors.country_contacts?.[watch('country')]?.company_phone ? 'error' : ''}`}
                  placeholder={`${countryCode[watch('country')]} 414 250 110`}
                />
                {errors.country_contacts?.[watch('country')]?.company_phone && (
                  <span className="error-message">{errors.country_contacts[watch('country')].company_phone.message}</span>
                )}
              </div>
            )}

            {watch('country') && (
              <div className="form-group">
                <label className="form-label">
                  Company Email
                  <span className="required-mark">*</span>
                </label>
                <input
                  {...register(`country_contacts.${watch('country')}.company_email`, { 
                    required: 'Company email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className={`form-input ${errors.country_contacts?.[watch('country')]?.company_email ? 'error' : ''}`}
                  placeholder={`${watch('country')}@company.com`}
                />
                {errors.country_contacts?.[watch('country')]?.company_email && (
                  <span className="error-message">{errors.country_contacts[watch('country')].company_email.message}</span>
                )}
              </div>
            )}
          </div>

          <div className="form-footer">
            <div className="form-buttons">
              <button
                type="button"
                onClick={handleReset}
                className="reset-button"
                disabled={isSubmitting || !isDirty}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Company' : 'Add Company'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}