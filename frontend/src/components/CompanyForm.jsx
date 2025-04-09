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
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    watch 
  } = useForm({
    defaultValues: {
      name: '',
      business_type: '',
      industry: '',
      website: '',
      phone_number: '',
      company_email: '',
      responsible_person: '',
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
          // Explicitly set each field to ensure proper mapping
          setValue('company_name', company.company_name)
          setValue('business_type', company.business_type)
          setValue('industry', company.industry)
          setValue('website', company.website)
          setValue('phone_number', company.phone_number)
          setValue('company_email', company.company_email)
          setValue('responsible_person', company.responsible_person)
          setValue('responsible_phone', company.responsible_phone)
          setValue('responsible_email', company.responsible_email)
          setValue('presence_in_kenya', company.presence_in_kenya)
          setValue('presence_in_uganda', company.presence_in_uganda)
          setValue('presence_in_tanzania', company.presence_in_tanzania)
          setValue('presence_in_rwanda', company.presence_in_rwanda)
          setIsDirty(false)
        } catch (error) {
          console.error('Error fetching company:', error)
          setToast({
            message: 'Failed to load company details',
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
      if (isEdit) {
        await updateCompany(id, data)
        setToast({
          message: 'Company updated successfully',
          type: 'success'
        })
      } else {
        await addCompany(data)
        setToast({
          message: 'Company added successfully', 
          type: 'success'
        })
      }
      setIsDirty(false)
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      setToast({
        message: error.message || 'Failed to save company',
        type: 'error'
      })
      console.error('Error saving company:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All changes will be lost.')) {
      reset()
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
                {...register('company_name')}
                className="form-input"
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Business Type
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('business_type')}
                className="form-input"
                placeholder="e.g., Manufacturing, Retail"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Industry
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('industry')}
                className="form-input"
                placeholder="e.g., Technology, Finance"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                {...register('website')}
                className="form-input"
                placeholder="https://www.example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                {...register('phone_number')}
                className="form-input"
                placeholder="+254 700 000 000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register('company_email')}
                type="email"
                className="form-input"
                placeholder="contact@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Responsible Person</label>
              <input
                {...register('responsible_person')}
                className="form-input"
                placeholder="Full name of contact person"
              />
            </div>


              {watch('selectedCountry') && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      {`${watch('selectedCountry').charAt(0).toUpperCase() + watch('selectedCountry').slice(1)} Contact Phone`}
                    </label>
                    <input
                      {...register(`${watch('selectedCountry')}_contact_phone`)}
                      className="form-input"
                      placeholder={`e.g. ${watch('selectedCountry') === 'kenya' ? '+254' : watch('selectedCountry') === 'uganda' ? '+256' : watch('selectedCountry') === 'tanzania' ? '+255' : '+250'} 700 000 000`}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {`${watch('selectedCountry').charAt(0).toUpperCase() + watch('selectedCountry').slice(1)} Contact Email`}
                    </label>
                    <input
                      {...register(`${watch('selectedCountry')}_contact_email`)}
                      type="email"
                      className="form-input"
                      placeholder={`${watch('selectedCountry')}.contact@company.com`}
                    />
                  </div>
                </>
              )}

            <div className="presence-section">
              <label className="presence-label">
                Company Presence
                <span className="required-mark">*</span>
                <span className="helper-text">(Select at least one country)</span>
              </label>
              <div className="presence-grid">
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('presence_in_kenya')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Kenya</span>
                </label>
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('presence_in_uganda')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Uganda</span>
                </label>
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('presence_in_tanzania')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Tanzania</span>
                </label>
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('presence_in_rwanda')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Rwanda</span>
                </label>
              </div>
            </div>

            <div className="form-footer">
              <div className="country-selection">
                <label className="form-label">
                  Country Details For:
                  <span className="required-mark">*</span>
                </label>
                <select
                  className="form-input"
                  {...register('selectedCountry', { required: true })}
                >
                  <option value="">Select Country</option>
                  <option value="kenya">Kenya</option>
                  <option value="uganda">Uganda</option>
                  <option value="tanzania">Tanzania</option>
                  <option value="rwanda">Rwanda</option>
                </select>
              </div>
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
          </div>
        </form>
      </div>
    </div>
  )
}
