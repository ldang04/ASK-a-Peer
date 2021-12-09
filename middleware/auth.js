const jwt = require('jsonwebtoken'); 
const config = require('config');

module.exports = (req, res, next) => {
    console.log('req header:');
    console.log(req.header);
    // Get token from header 
    const token = req.header('x-auth-token');

    // Check if no token 
    if(!token){
        return res.status(401).json({ msg: 'User is not logged in'});
    }

    // Verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        
        req.user = decoded.user; 
        next();
    } catch {  
        res.status(401).json({ msg: 'User session expired. Login again.'});
    }
}