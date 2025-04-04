import { Link } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          Company DB
        </Link>
        <div className="flex space-x-4">
          <Link 
            to="/companies/new" 
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Company
          </Link>
        </div>
      </div>
    </nav>
  )
}
