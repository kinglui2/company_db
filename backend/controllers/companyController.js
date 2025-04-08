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

// Delete a company from the database
exports.deleteCompany = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM companies WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Company not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Company deleted successfully',
      deletedId: id
    });
    });
};

// Update a company in the database
exports.updateCompany = (req, res) => {
  const { id } = req.params;
  const { company_name, business_type, industry, website, responsible_person, phone_number, company_email, presence_in_kenya, presence_in_uganda, presence_in_tanzania } = req.body;

  const sql = `UPDATE companies SET 
      company_name = ?,
      business_type = ?,
      industry = ?,
      website = ?,
      responsible_person = ?,
      phone_number = ?,
      company_email = ?,
      presence_in_kenya = ?,
      presence_in_uganda = ?,
      presence_in_tanzania = ?
      WHERE id = ?`;

  db.query(sql, [
      company_name,
      business_type,
      industry,
      website,
      responsible_person,
      phone_number,
      company_email,
      presence_in_kenya,
      presence_in_uganda,
      presence_in_tanzania,
      id
  ], (err, result) => {
      if (err) {
          return res.status(500).json({ 
              success: false,
              error: 'Database operation failed',
              details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ 
              success: false,
              error: 'Company not found' 
          });
      }
      res.json({ 
          success: true,
          message: 'Company updated successfully',
          updatedId: id
      });
  });
};
