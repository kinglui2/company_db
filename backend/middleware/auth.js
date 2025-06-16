const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to verify JWT token
exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [decoded.id]);
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid token. User not found.' 
            });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            error: 'Invalid token.' 
        });
    }
};

// Middleware to check if user is an editor
exports.isEditor = (req, res, next) => {
    if (req.user.role !== 'editor') {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied. Editor role required.' 
        });
    }
    next();
}; 