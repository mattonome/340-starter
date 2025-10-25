const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkJWT(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("error_msg", "You must log in to view this page.");
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = decoded;
    res.locals.account = decoded;
    next();
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Invalid session, please log in again.");
    return res.redirect("/auth/login");
  }
}

function checkEmployeeOrAdmin(req, res, next) {
  checkJWT(req, res, () => {
    if (req.account.account_type === "Employee" || req.account.account_type === "Admin") {
      return next();
    } else {
      req.flash("error_msg", "You do not have permission to access this page.");
      return res.redirect("/auth/login");
    }
  });
}

module.exports = { checkJWT, checkEmployeeOrAdmin };
