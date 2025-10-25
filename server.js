/******************************************
 * Main Server File (server.js)
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const flash = require("connect-flash")
const expressMessages = require("express-messages")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv").config()
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities")
const bodyParser = require("body-parser")

/* ***********************
 * Express App
 *************************/
const app = express()

/* ***********************
 * Middleware
 *************************/

// Serve static files (CSS, JS, Images)
app.use(express.static("public"))

// Body parser for forms and JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser (for JWT)
app.use(cookieParser())

// Session setup (stored in PostgreSQL)
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minutes
      secure: false, // change to true if using HTTPS
      httpOnly: true,
    },
  })
)

// Flash middleware
app.use(flash())

// Attach flash messages to response locals
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res)
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.info_msg = req.flash("info_msg")
  next()
})

// Middleware to clear flash messages after display (safeguard)
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.session && req.session.flash) {
      delete req.session.flash
    }
  })
  next()
})

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Flash test route
app.get("/test-flash", (req, res) => {
  req.flash("success_msg", "✅ Email queued successfully!")
  req.flash("info_msg", "📨 Email sent to recipient!")
  req.flash("error_msg", "❌ Email delivery failed!")
  res.redirect("/")
})

// Simulated error route
app.get("/error", (req, res, next) => {
  next(new Error("Intentional server error for testing!"))
})

/* ***********************
 * 404 Handler (Catch-All)
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav
  try {
    nav = await utilities.getNav()
  } catch (navErr) {
    console.error("🚨 Error building nav during error handler:", navErr)
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }

  console.error(`🚨 Error at "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status === 404 ? "404 Not Found" : "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Server Setup
 *************************/
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`✅ App running at: http://localhost:${port}`)
})
