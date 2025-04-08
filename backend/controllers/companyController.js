const db = require('../config/db');

// Get all companies from the database
exports.getAllCompanies = (req, res) => {
    db.query('SELECT * FROM companies', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Add a new company to the database
exports.addCompany = (req, res) => {
    const { company_name, business_type, industry, website, responsible_person, phone_number, company_email, presence_in_kenya, presence_in_uganda, presence_in_tanzania } = req.body;

    const sql = 'INSERT INTO companies (company_name, business_type, industry, website, responsible_person, phone_number, company_email, presence_in_kenya, presence_in_uganda, presence_in_tanzania) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [company_name, business_type, industry, website, responsible_person, phone_number, company_email, presence_in_kenya, presence_in_uganda, presence_in_tanzania], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Company added successfully', id: result.insertId });
    });
};


