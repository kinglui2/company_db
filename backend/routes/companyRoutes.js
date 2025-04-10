const express = require('express');
const { getAllCompanies, getCompany, addCompany, updateCompany, deleteCompany, bulkImportCompanies } = require('../controllers/companyController');

const router = express.Router();

// Define routes for getting and adding companies
router.get('', getAllCompanies);
router.get('/:id', getCompany);
router.post('', addCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);
router.post('/bulk', bulkImportCompanies);

module.exports = router;

