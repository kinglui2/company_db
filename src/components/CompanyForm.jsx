import { useState, useEffect } from 'react'
import Toast from './Toast'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompany, addCompany, updateCompany } from '../api/companies'

export default function CompanyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm({
    mode: 'onChange'
  })

  useEffect(() => {
    if (isEdit) {
      const fetchCompany = async () => {
        try {
          const company = await getCompany(id)
          Object.entries(company).forEach(([key, value]) => {
            setValue(key, value)
          })
        } catch (error) {
          console.error('Error fetching company:', error)
        }
      }
      fetchCompany()
    }
  }, [id, isEdit, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
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

  return (
    <div className="relative">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Company' : 'Add New Company'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              {...register('name', { 
                required: 'Company name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <input
              {...register('businessType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Manufacturing, Retail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <input
              {...register('industry')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Technology, Finance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              {...register('website')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://www.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
            <input
              {...register('responsiblePerson')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Full name of contact person"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              {...register('phoneNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="+254 700 000 000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="contact@company.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Presence</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('kenya')}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Kenya</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('uganda')}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Uganda</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('tanzania')}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Tanzania</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
