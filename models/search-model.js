/******************************************
 * Search Model
 ******************************************/
const pool = require("../database/")

/* ****************************************
 *  Search inventory by keyword
 * **************************************** */
async function searchInventory(keyword) {
  try {
    const sql = `
      SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_description,inv_thumbnail, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c ON i.classification_id = c.classification_id
      WHERE i.inv_make ILIKE $1
         OR i.inv_model ILIKE $1
         OR c.classification_name ILIKE $1
      ORDER BY i.inv_make, i.inv_model;
    `
    const values = [`%${keyword}%`]
    const result = await pool.query(sql, values)
    return result.rows
  } catch (error) {
    console.error("❌ searchInventory error:", error)
    throw error
  }
}

module.exports = { searchInventory }
