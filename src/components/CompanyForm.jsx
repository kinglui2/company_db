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
      businessType: '',
      industry: '',
      website: '',
      phoneNumber: '',
      email: '',
      responsiblePerson: '',
      kenya: false,
      uganda: false,
      tanzania: false
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
          Object.entries(company).forEach(([key, value]) => {
            setValue(key, value)
          })
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
                {...register('name')}
                className="form-input"
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Type</label>
              <input
                {...register('businessType')}
                className="form-input"
                placeholder="e.g., Manufacturing, Retail"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry</label>
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
                {...register('phoneNumber')}
                className="form-input"
                placeholder="+254 700 000 000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register('email')}
                type="email"
                className="form-input"
                placeholder="contact@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Responsible Person
                <span className="required-mark">*</span>
              </label>
              <input
                {...register('responsiblePerson')}
                className="form-input"
                placeholder="Full name of contact person"
              />
            </div>

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
                    {...register('kenya')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Kenya</span>
                </label>
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('uganda')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Uganda</span>
                </label>
                <label className="presence-option">
                  <input
                    type="checkbox"
                    {...register('tanzania')}
                    className="presence-checkbox"
                  />
                  <span className="presence-text">Tanzania</span>
                </label>
              </div>
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
          </div>
        </form>
      </div>
    </div>
  )
}
