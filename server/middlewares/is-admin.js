module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.role !== "Admin") {
    return res.status(401).json({ status: false, message: "Not authorized" });
  }
  next();
};
