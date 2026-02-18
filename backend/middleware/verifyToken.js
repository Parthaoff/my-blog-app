const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token'); // Check for token in header
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Add user info to request
    next(); // Move to the next function (the actual route)
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = verifyToken;