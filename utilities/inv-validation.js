// **************************************
// inv-validation.js
// Handles validation for classification and new car forms
// **************************************

const { body, validationResult } = require("express-validator")
const utilities = require("./")

const invValidate = {}

/* **************************************
 * Classification Validation Rules
 * **************************************/
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters."),
  ]
}

/* **************************************
 * Check Classification Data
 * **************************************/
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
  }
  next()
}

/* **************************************
 * Inventory (New Car) Validation Rules
 * **************************************/
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle make."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle model."),
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please enter a valid year (1900–2099)."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a vehicle description."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle image path."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle thumbnail path."),
    body("inv_price")
      .isFloat({ gt: 0 })
      .withMessage("Please provide a valid price greater than 0."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid number."),
    body("classification_id")
      .isInt()
      .withMessage("Please select a classification."),
  ]
}

/* **************************************
 * Check Inventory (New Car) Data
 * **************************************/
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.render("inventory/new-car", {
      title: "Add New Car",
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body, // repopulate form fields
    })
  }
  next()
}

module.exports = invValidate
