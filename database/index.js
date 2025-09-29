const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL required for Render (production)
 * For local dev, you can disable SSL if needed
 * *************** */

let pool

if (process.env.NODE_ENV === "development") {
  // Local dev (can skip SSL if running local Postgres)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // comment out ssl if your local db doesn’t need it
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Add query logger for development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  // Production (Render) - must use SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  module.exports = pool
}
