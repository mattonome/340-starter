/* ******************************************
 * Account Route
 *******************************************/

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// GET login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// POST login form
router.post("/login", utilities.handleErrors(accountController.handleLogin));

// GET registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;
