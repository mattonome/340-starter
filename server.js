/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")

/* ***********************
 * Middleware
 *************************/
// Serve static files (CSS, JS, images) from "public" folder
app.use(express.static("public"))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // layout file inside views/layouts

/* ***********************
 * Routes
 *************************/
// If you had custom routes, import them here
// Example: const staticRoutes = require("./routes/static")
// app.use(staticRoutes)

/* ***********************
 * Index Route
 *************************/
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
})
