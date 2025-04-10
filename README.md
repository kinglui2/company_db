# Company Database Management System

A full-stack application for managing company information across multiple East African countries (Kenya, Uganda, Tanzania, and Rwanda). The system allows users to add, view, edit, and manage company details including contact information for each country.

## Features

- **Company Management**
  - Add new companies with detailed information
  - View company listings with filtering options
  - Edit existing company details
  - Delete companies
  - Bulk import companies via CSV

- **Country-Specific Contacts**
  - Manage contact information for each country separately
  - Track company presence in multiple countries
  - Handle different contact formats for each country

- **Data Export**
  - Export company data to CSV
  - Customizable export formats

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Axios
- Heroicons

### Backend
- Node.js
- Express
- MySQL
- CORS
- dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd company-db
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Setup**
   - Create a MySQL database
   - Import the database schema from `backend/database/company_db.sql`
   - Create a `.env` file in the backend directory with the following variables:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=company_db
     PORT=5000
     ```

## Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
company-db/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── companyController.js
│   ├── database/
│   │   └── company_db.sql
│   ├── routes/
│   │   └── companyRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompaniesList.jsx
│   │   │   ├── CompanyForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── api/
│   │   │   └── companies.js
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get a specific company
- `POST /api/companies` - Add a new company
- `PUT /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Delete a company
- `POST /api/companies/bulk` - Bulk import companies

## Bulk Import

The system supports bulk importing companies via CSV. A template can be downloaded from the application interface. The CSV should include:

- Company basic information
- Presence flags for each country
- Contact information for each country where the company is present

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the maintainers. 