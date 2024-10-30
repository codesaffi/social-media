const jwt = require('jsonwebtoken');

// Middleware to check for and verify JWT token
const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    console.log('Received Token:', token); // Log the received token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Payload:', decoded); // Log the decoded payload
    req.user = decoded.user; // Add the user payload (id and username) to req.user
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;