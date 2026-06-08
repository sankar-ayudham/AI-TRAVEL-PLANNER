const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token exists or if it doesn't start with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Extract the actual token string (removing the "Bearer " part)
    const token = authHeader.split(' ')[1];
    
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's ID to the request so other functions know exactly who is making the request
    req.user = decoded.user;
    
    // Move on to the next function
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};