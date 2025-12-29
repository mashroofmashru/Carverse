const authorize = (allowedRoles) => {
  return (req, res, next) => {
    console.log("Decoded user:", req.user);
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};

module.exports = authorize;
