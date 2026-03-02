const jwt = require("jsonwebtoken");

// Role based auth middleware
const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;

      if (!header)
        return res.status(401).json({ message: "No token provided" });

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user role matches
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;