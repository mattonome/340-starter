/********************************************
 * Main server.js file
 ********************************************/
const express = require("express")
const env = require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"))

/* ***********************
 * Index Route
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Server Setup
 *************************/
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
