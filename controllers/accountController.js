const utilities = require("../utilities");

/* ****************************************
*  Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
    const nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
    });
}

/* ****************************************
*  Process login form
**************************************** */
async function handleLogin(req, res, next) {
    const { account_email, account_password } = req.body;

    // Dummy validation (replace with real DB check later)
    if (account_email === "test@example.com" && account_password === "123456") {
        req.flash("success", "✅ Login successful!");
        res.redirect("/"); // Redirect to home after successful login
    } else {
        req.flash("error", "❌ Invalid email or password.");
        res.redirect("/account/login"); // Redirect back to login page
    }
}

/* ****************************************
*  Deliver registration view
**************************************** */
async function buildRegister(req, res, next) {
    const nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null, // placeholder for validation errors
    });
}

module.exports = { buildLogin, handleLogin, buildRegister };
