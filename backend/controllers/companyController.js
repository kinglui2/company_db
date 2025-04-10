const db = require('../config/db');

// Get a single company by ID with its country contacts
exports.getCompany = (req, res) => {
    const { id } = req.params;
    
    // First get the company details
    const companySql = 'SELECT * FROM companies WHERE id = ?';
    const contactsSql = 'SELECT * FROM country_contacts WHERE company_id = ?';
    
    db.query(companySql, [id], (err, companyResult) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: 'Database operation failed',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (companyResult.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Company not found' 
            });
        }

        // Then get the country contacts
        db.query(contactsSql, [id], (err, contactsResult) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: 'Database operation failed',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            // Combine the results
            const company = companyResult[0];
            company.countryContacts = contactsResult.reduce((acc, contact) => {
                acc[contact.country] = {
                    responsible_person: contact.responsible_person,
                    company_email: contact.company_email,
                    company_phone: contact.company_phone,
                    responsible_phone: contact.responsible_phone,
                    responsible_email: contact.responsible_email
                };
                return acc;
            }, {});

            res.json(company);
        });
    });
};

// Get all companies with their country contacts
exports.getAllCompanies = (req, res) => {
    const companiesSql = 'SELECT * FROM companies';
    const contactsSql = 'SELECT * FROM country_contacts';
    
    db.query(companiesSql, (err, companies) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.query(contactsSql, (err, contacts) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Group contacts by company
            const contactsByCompany = contacts.reduce((acc, contact) => {
                if (!acc[contact.company_id]) {
                    acc[contact.company_id] = {};
                }
                acc[contact.company_id][contact.country] = {
                    responsible_person: contact.responsible_person,
                    company_email: contact.company_email,
                    company_phone: contact.company_phone,
                    responsible_phone: contact.responsible_phone,
                    responsible_email: contact.responsible_email
                };
                return acc;
            }, {});

            // Add contacts to each company
            const companiesWithContacts = companies.map(company => ({
                ...company,
                countryContacts: contactsByCompany[company.id] || {}
            }));

            res.json(companiesWithContacts);
        });
    });
};

// Add a new company with its country contacts
exports.addCompany = (req, res) => {
    const { 
        company_name,
        business_type,
        industry,
        website,
        presence_in_kenya,
        presence_in_uganda, 
        presence_in_tanzania,
        presence_in_rwanda,
        countryContacts
    } = req.body;

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // First insert the company
        const companySql = `INSERT INTO companies (
            company_name, business_type, industry, website,
            presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(companySql, [
            company_name, business_type, industry, website,
            presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda
        ], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }

            const companyId = result.insertId;

            // Then insert country contacts if any
            if (countryContacts && Object.keys(countryContacts).length > 0) {
                const contactsSql = `INSERT INTO country_contacts (
                    company_id, country, responsible_person, company_email,
                    company_phone, responsible_phone, responsible_email
                ) VALUES ?`;

                const contactsValues = Object.entries(countryContacts).map(([country, contact]) => [
                    companyId,
                    country,
                    contact.responsible_person,
                    contact.company_email,
                    contact.company_phone,
                    contact.responsible_phone,
                    contact.responsible_email
                ]);

                db.query(contactsSql, [contactsValues], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }
                        res.json({ message: 'Company added successfully', id: companyId });
                    });
                });
            } else {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.json({ message: 'Company added successfully', id: companyId });
                });
            }
        });
    });
};

// Delete a company and its country contacts
exports.deleteCompany = (req, res) => {
    const { id } = req.params;
    
    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // First delete the company (this will cascade delete contacts)
        const sql = 'DELETE FROM companies WHERE id = ?';
        
        db.query(sql, [id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ 
                        success: false,
                        error: 'Database operation failed',
                        details: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                });
            }
            if (result.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ 
                        success: false,
                        error: 'Company not found' 
                    });
                });
            }

            db.commit(err => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }
                res.json({ 
                    success: true,
                    message: 'Company deleted successfully',
                    deletedId: id
                });
            });
        });
    });
};

// Update a company and its country contacts
exports.updateCompany = (req, res) => {
    const { id } = req.params;
    const { 
        company_name,
        business_type,
        industry,
        website,
        presence_in_kenya,
        presence_in_uganda,
        presence_in_tanzania,
        presence_in_rwanda,
        countryContacts
    } = req.body;

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // First update the company
        const companySql = `UPDATE companies SET 
            company_name = ?,
            business_type = ?,
            industry = ?,
            website = ?,
            presence_in_kenya = ?,
            presence_in_uganda = ?,
            presence_in_tanzania = ?,
            presence_in_rwanda = ?
            WHERE id = ?`;

        db.query(companySql, [
            company_name,
            business_type,
            industry,
            website,
            presence_in_kenya,
            presence_in_uganda,
            presence_in_tanzania,
            presence_in_rwanda,
            id
        ], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }
            if (result.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ 
                        success: false,
                        error: 'Company not found' 
                    });
                });
            }

            // Then update country contacts
            if (countryContacts && Object.keys(countryContacts).length > 0) {
                // For each country in the contacts, update or insert
                const updates = [];
                const inserts = [];
                
                Object.entries(countryContacts).forEach(([country, contact]) => {
                    if (contact.responsible_person || contact.company_email || contact.company_phone || 
                        contact.responsible_phone || contact.responsible_email) {
                        // Check if contact exists for this country
                        const checkSql = 'SELECT id FROM country_contacts WHERE company_id = ? AND country = ?';
                        db.query(checkSql, [id, country], (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }

                            if (result.length > 0) {
                                // Update existing contact
                                const updateSql = `UPDATE country_contacts SET 
                                    responsible_person = ?,
                                    company_email = ?,
                                    company_phone = ?,
                                    responsible_phone = ?,
                                    responsible_email = ?
                                    WHERE company_id = ? AND country = ?`;
                                
                                db.query(updateSql, [
                                    contact.responsible_person,
                                    contact.company_email,
                                    contact.company_phone,
                                    contact.responsible_phone,
                                    contact.responsible_email,
                                    id,
                                    country
                                ], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ error: err.message });
                                        });
                                    }
                                });
                            } else {
                                // Insert new contact
                                const insertSql = `INSERT INTO country_contacts (
                                    company_id, country, responsible_person, company_email,
                                    company_phone, responsible_phone, responsible_email
                                ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                
                                db.query(insertSql, [
                                    id,
                                    country,
                                    contact.responsible_person,
                                    contact.company_email,
                                    contact.company_phone,
                                    contact.responsible_phone,
                                    contact.responsible_email
                                ], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ error: err.message });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.json({ 
                        success: true,
                        message: 'Company updated successfully',
                        updatedId: id
                    });
                });
            } else {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.json({ 
                        success: true,
                        message: 'Company updated successfully',
                        updatedId: id
                    });
                });
            }
        });
    });
};

// Bulk import companies with their country contacts
exports.bulkImportCompanies = (req, res) => {
    const companies = req.body;
    
    if (!Array.isArray(companies) || companies.length === 0) {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid input: expected an array of companies' 
        });
    }

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each company
        const processNextCompany = (index) => {
            if (index >= companies.length) {
                // All companies processed
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }
                    res.json({
                        success: true,
                        message: `Successfully imported ${successCount} companies${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
                        details: {
                            successCount,
                            errorCount,
                            errors: errorCount > 0 ? errors : undefined
                        }
                    });
                });
                return;
            }

            const company = companies[index];
            const {
                company_name,
                business_type,
                industry,
                website,
                presence_in_kenya,
                presence_in_uganda,
                presence_in_tanzania,
                presence_in_rwanda,
                country_contacts
            } = company;

            // Insert the company
            const companySql = `INSERT INTO companies (
                company_name, business_type, industry, website,
                presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(companySql, [
                company_name, business_type, industry, website,
                presence_in_kenya, presence_in_uganda, presence_in_tanzania, presence_in_rwanda
            ], (err, result) => {
                if (err) {
                    errorCount++;
                    errors.push({
                        index,
                        company: company_name,
                        error: err.message
                    });
                    processNextCompany(index + 1);
                    return;
                }

                const companyId = result.insertId;

                // Insert country contacts if any
                if (country_contacts && Object.keys(country_contacts).length > 0) {
                    const contactsSql = `INSERT INTO country_contacts (
                        company_id, country, responsible_person, company_email,
                        company_phone, responsible_phone, responsible_email
                    ) VALUES ?`;

                    const contactsValues = Object.entries(country_contacts)
                        .filter(([country, contact]) => contact.responsible_person || contact.company_email || contact.company_phone)
                        .map(([country, contact]) => [
                            companyId,
                            country,
                            contact.responsible_person,
                            contact.company_email,
                            contact.company_phone,
                            contact.responsible_phone,
                            contact.responsible_email
                        ]);

                    if (contactsValues.length > 0) {
                        db.query(contactsSql, [contactsValues], (err) => {
                            if (err) {
                                errorCount++;
                                errors.push({
                                    index,
                                    company: company_name,
                                    error: `Failed to add contacts: ${err.message}`
                                });
                            } else {
                                successCount++;
                            }
                            processNextCompany(index + 1);
                        });
                    } else {
                        successCount++;
                        processNextCompany(index + 1);
                    }
                } else {
                    successCount++;
                    processNextCompany(index + 1);
                }
            });
        };

        // Start processing companies
        processNextCompany(0);
    });
};
