/* ******************************************
 * Main Server File (server.js)
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const flash = require("connect-flash");
const expressMessages = require("express-messages");
const dotenv = require("dotenv").config();
const pool = require("./database/");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");
const bodyParser = require("body-parser");

const app = express();

/* ***********************
 * Middleware
 *************************/

// ✅ Serve static files (CSS, JS, Images)
app.use(express.static("public"));

// ✅ Body parser for forms and JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Session setup (stored in PostgreSQL)
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minutes
      secure: false, // set to true if using HTTPS
      httpOnly: true,
    },
  })
);

// ✅ Flash middleware
app.use(flash());

// ✅ Attach flash messages to response locals
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// ✅ Middleware to clear flash messages after one display
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.session && req.session.flash) {
      delete req.session.flash;
    }
  });
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/

// ✅ Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// ✅ Inventory routes
app.use("/inv", inventoryRoute);

// ✅ Account routes
app.use("/account", accountRoute);

// ✅ Flash test route
app.get("/test-flash", (req, res) => {
  req.flash("info", "✅ Email queued");
  req.flash("info", "📨 Email sent");
  req.flash("error", "❌ Email delivery failed");
  res.redirect("/");
});

// ✅ Simulated server error route
app.get("/error", (req, res, next) => {
  next(new Error("Intentional server error for testing!"));
});

// ✅ 404 handler
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`🚨 Error at "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Server Setup
 *************************/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ App running at: http://localhost:${port}`);
});
