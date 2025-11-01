/******************************************
 * Inventory Controller
 ******************************************/
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ****************************************
 * Build inventory management page
 ****************************************/
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      vehicles: null,
      selectedClassification: null,
      messages: req.flash(),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build management table filtered by classification
 ****************************************/
async function buildManagementTable(req, res, next) {
  try {
    const classification_id = parseInt(req.query.classification_id)
    const vehicles = classification_id
      ? await invModel.getInventoryByClassificationId(classification_id)
      : []

    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      selectedClassification: classification_id,
      vehicles,
      messages: req.flash(),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build inventory by classification for public view
 ****************************************/
async function buildInventoryByClassification(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const vehicles = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    // Build the grid safely
    const grid = vehicles && vehicles.length > 0
      ? await utilities.buildClassificationGrid(vehicles)
      : '<p class="notice">Sorry, no matching vehicles could be found.</p>'

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).render("errors/404", {
        title: "No Vehicles Found",
        nav,
        message: "Sorry, we appear to have lost that page.",
      })
    }

    res.render("inventory/classification", {
      title: vehicles.length
        ? `Inventory - ${vehicles[0].classification_name}`
        : "Inventory",
      nav,
      classifications,
      selectedClassification: classification_id,
      vehicles,
      grid,          // <-- pass the grid to the template
      messages: req.flash(),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build add inventory page
 ****************************************/
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    res.render("inventory/new-car", {
      title: "Add New Car",
      nav,
      classifications,
      errors: null,
      messages: req.flash(),
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
      inv_id: null,
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 * Add new inventory item
 ****************************************/
async function addInventory(req, res, next) {
  try {
    const vehicle = {
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    }

    const result = await invModel.addCar(vehicle)

    if (result) {
      req.flash(
        "success_msg",
        `Vehicle "${vehicle.inv_make} ${vehicle.inv_model}" added successfully!`
      )
      res.redirect("/inv/management")
    } else {
      req.flash("error_msg", "Failed to add vehicle.")
      res.redirect("/inv/add-inventory")
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build edit inventory page
 ****************************************/
async function editInventoryView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleById(inv_id)

    if (!data) {
      const nav = await utilities.getNav()
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, we appear to have lost that page.",
      })
    }

    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    res.render("inventory/new-car", {
      title: `Edit ${data.inv_make} ${data.inv_model}`,
      nav,
      classifications,
      errors: null,
      messages: req.flash(),
      inv_make: data.inv_make,
      inv_model: data.inv_model,
      inv_year: data.inv_year,
      inv_description: data.inv_description,
      inv_image: data.inv_image,
      inv_thumbnail: data.inv_thumbnail,
      inv_price: data.inv_price,
      inv_miles: data.inv_miles,
      inv_color: data.inv_color,
      classification_id: data.classification_id,
      inv_id: data.inv_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Update inventory item
 ****************************************/
async function updateInventory(req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const vehicle = {
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    }

    const result = await invModel.updateCar(inv_id, vehicle)

    if (result) {
      req.flash("success_msg", "Vehicle updated successfully!")
      res.redirect("/inv/management")
    } else {
      req.flash("error_msg", "Vehicle update failed.")
      res.redirect(`/inv/edit/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build single vehicle detail view
 ****************************************/
async function buildVehicleDetail(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const vehicle = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, we appear to have lost that page.",
      })
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      classifications,
      vehicle,
      messages: req.flash(),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}



/* ****************************************
 * Build add classification page
 ****************************************/
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash(),
      errors: null,
      classification_name: "",
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Add new classification
 ****************************************/
async function addClassification(req, res, next) {
  try {
    const classification_name = req.body.classification_name

    if (!classification_name || classification_name.trim() === "") {
      req.flash("error_msg", "Classification name is required.")
      return res.redirect("/inv/add-classification")
    }

    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash(
        "success_msg",
        `Classification "${classification_name}" added successfully!`
      )
    } else {
      req.flash("error_msg", "Failed to add classification.")
    }

    res.redirect("/inv/management")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Delete inventory item
 ****************************************/
async function deleteInventory(inv_id) {
  try {
    const deleted = await invModel.deleteCar(inv_id)
    return deleted
  } catch (error) {
    console.error("❌ deleteInventory error:", error)
    throw error
  }
}

/* ****************************************
 * Search vehicles
 **************************************** */
async function searchInventory(req, res, next) {
  try {
    const searchTerm = req.query.q
    const nav = await utilities.getNav()

    if (!searchTerm || searchTerm.trim() === "") {
      req.flash("error_msg", "Please enter a search term.")
      return res.redirect("/")
    }

    // fetch vehicles matching term
    const vehicles = await invModel.searchInventory(searchTerm)

    res.render("inventory/search-results", {
      title: `Search Results for "${searchTerm}"`,
      nav,
      vehicles,
      searchTerm,
      messages: req.flash(),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}


/* ****************************************
 * Exports
 ****************************************/
module.exports = {
  buildManagement,
  buildManagementTable,
  buildInventoryByClassification,
  buildVehicleDetail, 
  buildAddInventory,
  addInventory,
  editInventoryView,
  updateInventory,
  buildAddClassification,
  addClassification,
  deleteInventory,
  searchInventory, 

}
