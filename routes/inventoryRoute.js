/******************************************
 * Inventory Routes
 ******************************************/
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Redirect /inv to /inv/management
router.get("/", (req, res) => {
  res.redirect("/inv/management")
})

// Inventory management pages
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagement)
)
router.get(
  "/management-table",
  utilities.handleErrors(invController.buildManagementTable)
)

// Public inventory by classification
router.get(
  "/type/:classification_id",
    utilities.handleErrors(invController.buildInventoryByClassification)
)

router.get("/detail/:inv_id", invController.buildVehicleDetail)


// Add inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)
router.post(
  "/update-inventory",
  utilities.handleErrors(invController.updateInventory)
)

// Add classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
)

// Delete inventory (POST)
router.post(
  "/delete/:inv_id",
  utilities.handleErrors(async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    const deleted = await invController.deleteInventory(inv_id)

    if (deleted) {
      req.flash("success_msg", "Vehicle deleted successfully!")
    } else {
      req.flash("error_msg", "Failed to delete vehicle.")
    }

    res.redirect("/inv/management")
  })
)

module.exports = router
