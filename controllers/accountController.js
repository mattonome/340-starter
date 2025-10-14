/******************************************
 * Account Controller
 ******************************************/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/******************************************
 * Deliver Login View
 ******************************************/
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  const messages = req.flash("notice"); // ✅ fetch flash message
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages,
  });
}

/******************************************
 * Deliver Registration View
 ******************************************/
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/******************************************
 * Register a New Account
 ******************************************/
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Save the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", "Registration successful. Please log in."); // ✅ flash message
      return res.redirect("/account/login"); // ✅ redirect instead of render
    } else {
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: ["Registration failed. Please try again."],
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: ["Error encrypting or saving account data."],
    });
  }
}

/******************************************
 * Handle Account Login
 ******************************************/
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    // Get user by email
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: ["No account found with that email."],
      });
    }

    // Compare passwords
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (!match) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: ["Incorrect password. Try again."],
      });
    }

    // Create JWT token
    delete accountData.account_password;
    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    // Set token as HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    });

    return res.redirect("/account");
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: ["An unexpected error occurred. Please try again."],
    });
  }
}

/******************************************
 * Deliver Account Management View
 ******************************************/
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/******************************************
 * Module Exports
 ******************************************/
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement, // ✅ make sure this is exported
};
