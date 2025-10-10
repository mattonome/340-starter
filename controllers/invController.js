const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
 *  Management Dashboard
 * **************************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      vehicles: [],
      selectedClassification: null,
      errors: null,
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Management Table (Dropdown reload)
 * **************************************** */
invCont.buildManagementTable = async function (req, res, next) {
  try {
    const classification_id = req.query.classification_id || null
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    let vehicles = []
    if (classification_id) {
      vehicles = await invModel.getInventoryByClassificationId(classification_id)
    }

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      vehicles,
      selectedClassification: classification_id,
      errors: null,
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Build Inventory by Classification
 * **************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0]?.classification_name || "Unknown"

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Build Vehicle Detail
 * **************************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()
    const detail = await utilities.buildDetailView(data[0])
    const name = `${data[0].inv_make} ${data[0].inv_model}`

    res.render("inventory/detail", {
      title: name,
      nav,
      detail,
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Add Classification View
 * **************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Add Classification Action
 * **************************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    const nav = await utilities.getNav()

    if (result) {
      req.flash("info", "✅ Classification added successfully!")
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        classifications: await invModel.getClassifications(),
        vehicles: [],
        selectedClassification: null,
        errors: null,
        messages: req.flash(),
      })
    } else {
      req.flash("error", "❌ Failed to add classification.")
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
        messages: req.flash(),
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Build Add Inventory (New Car) View
 * **************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/new-car", {
      title: "Add New Car",
      nav,
      classificationSelect,
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
      inv_color: "",          // ✅ must be defined
      classification_id: "",
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Add New Car (Inventory) Action
 * **************************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,            // ✅ included
      classification_id,
    } = req.body

    const result = await invModel.addCar({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,           // ✅ included
      classification_id,
    })

    const nav = await utilities.getNav()
    if (result) {
      req.flash("info", "✅ New car added successfully!")
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        classifications: await invModel.getClassifications(),
        vehicles: [],
        selectedClassification: null,
        errors: null,
        messages: req.flash(),
      })
    } else {
      req.flash("error", "❌ Failed to add new car.")
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      res.status(500).render("inventory/new-car", {
        title: "Add New Car",
        nav,
        classificationSelect,
        errors: null,
        messages: req.flash(),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,       // ✅ included
        classification_id,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Build Edit Inventory View
 * **************************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const itemData = (await invModel.getVehicleById(inv_id))[0]
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()

    res.render("inventory/edit-inventory", {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      itemData,
      classifications,
      errors: null,
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Process Edit Inventory
 * **************************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,          // ✅ included
      classification_id,
    } = req.body

    const updateResult = await invModel.updateCar(inv_id, {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,          // ✅ included
      classification_id,
    })

    if (updateResult) {
      req.flash("info", "✅ Vehicle updated successfully!")
      res.redirect("/inv")
    } else {
      req.flash("error", "❌ Update failed.")
      res.status(500).redirect(`/inv/edit/${inv_id}`)
    }
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Build Delete Inventory View
 * **************************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const itemData = (await invModel.getVehicleById(inv_id))[0]
    const nav = await utilities.getNav()

    res.render("inventory/delete-inventory", {
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      itemData,
      errors: null,
      messages: req.flash(),
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
 *  Process Delete Inventory
 * **************************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = req.body.inv_id
    const deleteResult = await invModel.deleteCar(inv_id)

    if (deleteResult) {
      req.flash("info", "✅ Vehicle deleted successfully!")
    } else {
      req.flash("error", "❌ Vehicle delete failed.")
    }

    res.redirect("/inv")
  } catch (err) {
    next(err)
  }
}

module.exports = invCont
