/******************************************
 * Search Controller (with Validation)
 ******************************************/
const searchModel = require("../models/search-model")
const utilities = require("../utilities/")

/* ****************************************
 *  Show search form
 * **************************************** */
async function buildSearchView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/search", {
    title: "Search Inventory",
    nav,
    errors: null,
    keyword: "",
    results: null,
  })
}

/* ****************************************
 *  Handle search request
 * **************************************** */
async function searchResults(req, res, next) {
  try {
    let nav = await utilities.getNav()
    let { keyword } = req.body

    // ✅ 1. Trim and sanitize the input
    keyword = keyword ? keyword.trim().replace(/[%_]/g, "") : ""

    // ✅ 2. Validate: ensure non-empty and not too long
    if (!keyword || keyword.length < 2) {
      return res.render("inventory/search", {
        title: "Search Inventory",
        nav,
        keyword,
        results: null,
        errors: "Please enter at least 2 valid characters to search.",
      })
    }

    // ✅ 3. Run the search query
    const results = await searchModel.searchInventory(keyword)

    // ✅ 4. Render results (or no-result message)
    res.render("inventory/search", {
      title: "Search Results",
      nav,
      results,
      keyword,
      errors: results.length === 0 ? "No matching vehicles found." : null,
    })
  } catch (error) {
    console.error("❌ Search error:", error.message)
    next(error)
  }
}

module.exports = { buildSearchView, searchResults }
