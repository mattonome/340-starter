const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 6 characters and include uppercase, lowercase, number, and symbol."
      ),
  ];
};

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

/* **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

/* **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 6 characters and include uppercase, lowercase, number, and symbol."
      ),
  ];
};

/* **********************************
 *  Check registration data
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 *  Check login data
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 *  Check update account data
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

/* **********************************
 *  Check password data
 * ********************************* */
validate.checkPasswordData = async (req, res, next) => {
  const { account_password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      errors: errors.array(),
      title: "Change Password",
      nav,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
