const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    // try Authorization header (Bearer) first, fall back to cookie 'token'
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    let token;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        // If browser expects HTML, redirect to signup page
        const accept = req.headers.accept || '';
        if (accept.includes('text/html')) {
            return res.redirect('/signup');
        }
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
        // token payload uses { id, username } in this app
        req.username = decoded.username;
        req.userId = decoded.id || decoded.userId;
        return next();
    } catch (err) {
        const accept = req.headers.accept || '';
        if (accept.includes('text/html')) {
            return res.redirect('/signup');
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = checkLogin;