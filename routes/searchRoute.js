/******************************************
 * Search Routes
 ******************************************/
const express = require("express")
const router = new express.Router()
const searchController = require("../controllers/searchController")

// Display search page
router.get("/", searchController.buildSearchView)

// Handle search form submission
router.post("/", searchController.searchResults)

module.exports = router
