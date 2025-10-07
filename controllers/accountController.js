const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Process login form (with password check)
 **************************************** */
async function handleLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    // 1️⃣ Find the user by email
    const account = await accountModel.getAccountByEmail(account_email);

    if (!account) {
      req.flash("error", "❌ No account found with that email.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash(),
      });
    }

    // 2️⃣ Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(account_password, account.account_password);

    if (!isMatch) {
      req.flash("error", "❌ Incorrect password. Please try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash(),
      });
    }

    // 3️⃣ If success — create session or redirect
    req.flash("success", `🎉 Welcome back, ${account.account_firstname}!`);
    return res.redirect("/account");
  } catch (error) {
    console.error("Login error:", error.message);
    req.flash("error", "An unexpected error occurred during login.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Process registration (with password hashing)
 **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // ✅ Step 1: Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // ✅ Step 2: Save user to DB
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    // ✅ Step 3: Handle result
    if (regResult) {
      req.flash("success", `🎉 Congratulations, ${account_firstname}! Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash(),
      });
    } else {
      req.flash("error", "❌ Registration failed. Please try again.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        messages: req.flash(),
      });
    }
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    req.flash("error", "An unexpected error occurred during registration.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Deliver account management view
 **************************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav();
  res.render("account/account", {
    title: "My Account",
    nav,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Exports
 **************************************** */
module.exports = {
  buildLogin,
  handleLogin,
  buildRegister,
  registerAccount,
  buildAccount,
};
