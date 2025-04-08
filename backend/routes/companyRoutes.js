const express = require('express');
const { getAllCompanies, addCompany } = require('../controllers/companyController');

const router = express.Router();

// Define routes for getting and adding companies
router.get('/', getAllCompanies);
router.post('/', addCompany);

module.exports = router;

