const express = require('express');
const { getAllCompanies, addCompany, deleteCompany } = require('../controllers/companyController');

const router = express.Router();

// Define routes for getting and adding companies
router.get('', getAllCompanies);
router.post('', addCompany);
router.delete('/:id', deleteCompany);

module.exports = router;

