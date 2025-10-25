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
  const messages = req.flash("notice"); // fetch flash messages
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
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", "Registration successful. Please log in.");
      return res.redirect("/account/login");
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
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: ["No account found with that email."],
      });
    }

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

    // Set HTTP-only cookie
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
  const accountData = res.locals.accountData; // fetched from JWT middleware

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
    messages: req.flash(),
  });
}

/******************************************
 * Deliver Account Update View
 ******************************************/
async function buildAccountUpdate(req, res, next) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    errors: null,
    messages: req.flash(),
  });
}

/******************************************
 * Process Account Info Update
 ******************************************/
async function updateAccountInfo(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

    if (result) {
      req.flash("success_msg", "Account information updated successfully.");
    } else {
      req.flash("error_msg", "Failed to update account information.");
    }

    return res.redirect("/account");
  } catch (error) {
    console.error("Account Update Error:", error);
    req.flash("error_msg", "An unexpected error occurred. Please try again.");
    return res.redirect("/account/update/" + account_id);
  }
}

/******************************************
 * Process Password Change
 ******************************************/
async function updatePassword(req, res, next) {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (result) {
      req.flash("success_msg", "Password updated successfully.");
    } else {
      req.flash("error_msg", "Failed to update password.");
    }

    return res.redirect("/account");
  } catch (error) {
    console.error("Password Update Error:", error);
    req.flash("error_msg", "An unexpected error occurred. Please try again.");
    return res.redirect("/account/update/" + account_id);
  }
}

/******************************************
 * Module Exports
 ******************************************/
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildAccountUpdate,
  updateAccountInfo,
  updatePassword,
};
