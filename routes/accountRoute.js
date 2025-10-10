/* ******************************************
 * Account Routes
 *******************************************/
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation")


// GET login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// GET registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


// POST login form
router.post("/login", utilities.handleErrors(accountController.handleLogin));

// GET account management page (My Account)
router.get("/", utilities.handleErrors(accountController.buildAccount));

module.exports = router;
