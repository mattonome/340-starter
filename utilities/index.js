/******************************************
 * Utilities Index
 ******************************************/
const jwt = require("jsonwebtoken")
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 **************************/
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    if (data && data.length > 0) {
      data.forEach((row) => {
        list += "<li>"
        list +=
          `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`
        list += "</li>"
      })
    }

    // ✅ Add Search link here (before closing </ul>)
    list += '<li><a href="/search" title="Search Inventory">Search</a></li>'

    list += "</ul>"
    return list
  } catch (error) {
    console.error("❌ Error building nav:", error.message)
    return "<ul><li><a href='/'>Home</a></li></ul>"
  }
}

/******************************************
 * Build the classification grid
 ******************************************/
Util.buildClassificationGrid = async function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'
  data.forEach((vehicle) => {
    let cleanPath = vehicle.inv_thumbnail.replace(/(\/vehicles)+/, "/vehicles")
    grid += "<li>"
    grid +=
      `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${cleanPath}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </a>`
    grid += '<div class="namePrice">'
    grid += "<hr />"
    grid +=
      `<h2>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          ${vehicle.inv_make} ${vehicle.inv_model}
        </a>
      </h2>`
    grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`
    grid += "</div></li>"
  })
  grid += "</ul>"
  return grid
}

/******************************************
 * Build detail view
 ******************************************/
Util.buildDetailView = async function (vehicle) {
  let cleanImage = vehicle.inv_image.replace(/(\/vehicles)+/, "/vehicles")
  return `
    <div class="vehicle-detail">
      <div class="vehicle-detail-image">
        <img src="${cleanImage}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Detail</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </div>
  `
}

/******************************************
 * Build classification select list
 ******************************************/
Util.buildClassificationList = async function (selectedId = null) {
  try {
    const data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classificationList" required>'
    list += "<option value=''>Choose a Classification</option>"

    if (data && data.length > 0) {
      data.forEach((row) => {
        const selected = selectedId && row.classification_id === parseInt(selectedId) ? " selected" : ""
        list += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
      })
    }

    list += "</select>"
    return list
  } catch (error) {
    console.error("❌ Error building classification list:", error.message)
    return '<select name="classification_id" id="classificationList"><option value="">Choose a Classification</option></select>'
  }
}

/******************************************
 * Middleware for Handling Errors
 ******************************************/
Util.handleErrors = function (fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next)
    } catch (err) {
      console.error("🚨 Error in route:", err.message)
      next(err)
    }
  }
}

/******************************************
 * Middleware: Verify JWT from cookie
 ******************************************/
Util.checkJWTToken = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next()
  }

  jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message)
      return next()
    }

    req.accountData = decoded
    res.locals.accountData = decoded
    next()
  })
}

/******************************************
 * Middleware: Protect Routes (Require Login)
 ******************************************/
Util.checkLogin = (req, res, next) => {
  if (!req.accountData) {
    console.log("Access denied: not logged in.")
    return res.redirect("/account/login")
  }
  next()
}

module.exports = Util
