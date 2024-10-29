const jwt = require('jsonwebtoken')
require('dotenv').config()
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    try {
      const decoded = jwt.verify(token, process.env.JWT);      
      req.user = decoded;
      next();
    } catch (err) {
        console.log(`${err.message}`);
        console.log(token);
        
      return res.status(403).json({ message: `Invalid or expired token ` });
    }
  };
  module.exports = authenticate;