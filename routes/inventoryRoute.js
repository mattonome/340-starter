// ********************************************
// Inventory Routes
// ********************************************

const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

/* ****************************************
 *  Inventory Management View
 * **************************************** */
router.get("/", utilities.handleErrors(invController.buildManagementView))

/* ****************************************
 *  Build inventory by classification view
 * **************************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ****************************************
 *  Build vehicle detail view
 * **************************************** */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

/* ****************************************
 *  Build "Add Classification" View
 * **************************************** */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

/* ****************************************
 *  Process "Add Classification" Form
 * **************************************** */
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 *  Build "Add New Car" View
 * **************************************** */
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

/* ****************************************
 *  Process "Add New Car" Form
 * **************************************** */
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

/* ****************************************
 *  Build Management Table with Dropdown Filter
 * **************************************** */
router.get(
  "/management/:classificationId?",
  utilities.handleErrors(invController.buildManagementTable)
)

/* ****************************************
 *  Build "Edit Inventory" View
 * **************************************** */
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.buildEditInventory)
)

/* ****************************************
 *  Process "Edit Inventory" Form
 * **************************************** */
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

/* ****************************************
 *  Build "Delete Inventory" View
 * **************************************** */
router.get(
  "/delete/:invId",
  utilities.handleErrors(invController.buildDeleteInventory)
)

/* ****************************************
 *  Process "Delete Inventory" Form
 * **************************************** */
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
