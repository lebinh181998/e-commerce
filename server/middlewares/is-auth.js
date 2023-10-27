module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ status: false, message: "Please login" });
  }
  next();
};
