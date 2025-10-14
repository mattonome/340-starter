/******************************************
 * Utilities Index
 ******************************************/
const jwt = require("jsonwebtoken");
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });

  list += "</ul>";
  return list;
};

/******************************************
 * Build the classification grid
 ******************************************/
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      let cleanPath = vehicle.inv_thumbnail.replace(/(\/vehicles)+/, "/vehicles");
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        cleanPath +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/******************************************
 * Build detail view
 ******************************************/
Util.buildDetailView = async function (vehicle) {
  let cleanImage = vehicle.inv_image.replace(/(\/vehicles)+/, "/vehicles");

  let detail = `
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
  `;
  return detail;
};

/******************************************
 * Build classification select list
 ******************************************/
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });

  classificationList += "</select>";
  return classificationList;
};

/******************************************
 * Middleware for Handling Errors
 ******************************************/
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/******************************************
 * Middleware: Verify JWT from cookie
 ******************************************/
Util.checkJWTToken = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next();
  }

  jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return next();
    }

    req.accountData = decoded;
    res.locals.accountData = decoded;
    next();
  });
};

/******************************************
 * Middleware: Protect Routes (Require Login)
 ******************************************/
Util.checkLogin = (req, res, next) => {
  if (!req.accountData) {
    console.log("Access denied: not logged in.");
    return res.redirect("/account/login");
  }
  next();
};

module.exports = Util;
