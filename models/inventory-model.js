/******************************************
 * Inventory Model
 ******************************************/
const pool = require("../database")

// Get all classification data
async function getClassifications() {
  try {
    const sql = "SELECT * FROM public.classification ORDER BY classification_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (err) {
    console.error("❌ getClassifications error:", err)
    throw err
  }
}

// Get inventory items by classification ID
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i 
      JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
      ORDER BY i.inv_make, i.inv_model
    `
    const data = await pool.query(sql, [classification_id])
    return data.rows
  } catch (error) {
    console.error("❌ getInventoryByClassificationId error:", error)
    throw error
  }
}

// Get single vehicle by inventory ID
async function getVehicleById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0] || null
  } catch (error) {
    console.error("❌ getVehicleById error:", error)
    throw error
  }
}

// Add new classification
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *
    `
    const result = await pool.query(sql, [classification_name.trim()])
    return result.rows[0]
  } catch (error) {
    console.error("❌ addClassification error:", error)
    throw error
  }
}

// Add new inventory item
async function addCar(vehicleData) {
  try {
    const sql = `
      INSERT INTO public.inventory
        (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
         inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const result = await pool.query(sql, [
      vehicleData.inv_make.trim(),
      vehicleData.inv_model.trim(),
      vehicleData.inv_year,
      vehicleData.inv_description.trim(),
      vehicleData.inv_image.trim(),
      vehicleData.inv_thumbnail.trim(),
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color.trim(),
      vehicleData.classification_id,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("❌ addCar error:", error)
    throw error
  }
}

// Update existing inventory item
async function updateCar(inv_id, vehicleData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *
    `
    const result = await pool.query(sql, [
      vehicleData.inv_make.trim(),
      vehicleData.inv_model.trim(),
      vehicleData.inv_year,
      vehicleData.inv_description.trim(),
      vehicleData.inv_image.trim(),
      vehicleData.inv_thumbnail.trim(),
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color.trim(),
      vehicleData.classification_id,
      inv_id,
    ])
    return result.rows[0] || null
  } catch (error) {
    console.error("❌ updateCar error:", error)
    throw error
  }
}

// Delete vehicle by ID
async function deleteCar(inv_id) {
  try {
    const sql = `
      DELETE FROM public.inventory
      WHERE inv_id = $1
      RETURNING *
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("❌ deleteCar error:", error)
    throw error
  }
}

// Exports
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addCar,
  updateCar,
  deleteCar,
}
