const db = require('../config/db');

// Get a single company by ID
exports.getCompany = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM companies WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Company not found' 
            });
        }
        res.json(result[0]);
    });
};

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
    const { 
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
      presence_in_rwanda,
      // Country-specific contacts
      kenya_contact_phone,
      kenya_contact_email,
      uganda_contact_phone,
      uganda_contact_email,
      tanzania_contact_phone,
      tanzania_contact_email,
      rwanda_contact_phone,
      rwanda_contact_email
    } = req.body;

    const sql = `INSERT INTO companies (
      company_name, business_type, industry, website,
      responsible_person, phone_number, company_email,
      presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda,
      kenya_contact_phone, kenya_contact_email,
      uganda_contact_phone, uganda_contact_email,
      tanzania_contact_phone, tanzania_contact_email,
      rwanda_contact_phone, rwanda_contact_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      company_name, business_type, industry, website,
      responsible_person, phone_number, company_email,
      presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda,
      kenya_contact_phone, kenya_contact_email,
      uganda_contact_phone, uganda_contact_email,
      tanzania_contact_phone, tanzania_contact_email,
      rwanda_contact_phone, rwanda_contact_email
    ], (err, result) => {
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
  const { 
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
    presence_in_rwanda,
    kenya_contact_phone,
    kenya_contact_email,
    uganda_contact_phone,
    uganda_contact_email,
    tanzania_contact_phone,
    tanzania_contact_email,
    rwanda_contact_phone,
    rwanda_contact_email
  } = req.body;

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
      presence_in_tanzania = ?,
      presence_in_rwanda = ?,
      kenya_contact_phone = ?,
      kenya_contact_email = ?,
      uganda_contact_phone = ?,
      uganda_contact_email = ?,
      tanzania_contact_phone = ?,
      tanzania_contact_email = ?,
      rwanda_contact_phone = ?,
      rwanda_contact_email = ?
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
      presence_in_rwanda,
      kenya_contact_phone,
      kenya_contact_email,
      uganda_contact_phone,
      uganda_contact_email,
      tanzania_contact_phone,
      tanzania_contact_email,
      rwanda_contact_phone,
      rwanda_contact_email,
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
