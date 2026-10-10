
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.get('Authorization');

  // Require exactly one Bearer token.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token || /\s/.test(token)) {
    return res.status(401).json({
      message: 'Invalid authentication token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // Tokens issued by this application contain { user: { id } }.
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !decoded.user ||
      typeof decoded.user.id !== 'string' ||
      !/^[a-fA-F0-9]{24}$/.test(decoded.user.id)
    ) {
      return res.status(401).json({
        message: 'Invalid authentication token',
      });
    }

    req.user = {
      id: decoded.user.id,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication token',
    });
  }
};
