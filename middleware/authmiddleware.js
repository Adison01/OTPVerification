module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized, please log in first" });
  }
  next();
};
