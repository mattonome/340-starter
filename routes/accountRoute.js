/******************************************
 * Account Routes
 ******************************************/
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// ******************************************
// Deliver login view
// ******************************************
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// ******************************************
// Deliver registration view
// ******************************************
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// ******************************************
// Process registration
// ******************************************
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// ******************************************
// Process login
// ******************************************
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// ******************************************
// Deliver account management view (protected)
// ******************************************
router.get(
  "/",
  utilities.checkJWTToken, // middleware to verify cookie token
  utilities.checkLogin,    // redirect if not logged in
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ******************************************
// Logout route
// ******************************************
router.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // remove JWT cookie
  res.redirect("/account/login");
});

module.exports = router;
