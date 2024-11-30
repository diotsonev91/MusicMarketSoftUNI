const jwt = require("jsonwebtoken");


const auth = (roles = []) => (req, res, next) => {
  // Extract token from authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    // Verify token with secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user role matches required roles
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden: You do not have the required permissions." });
    }

    // Attach user info to request for downstream use
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired. Please log in again." });
    }
    res.status(400).json({ error: "Invalid token." });
  }
};


module.exports = auth;
