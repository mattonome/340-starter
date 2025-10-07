const pool = require("../database/index");

/* ****************************************
 *  Register a new account (password is hashed before insertion)
 **************************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES 
        ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type;
    `;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password // should already be hashed in controller
    ]);

    return result.rows[0]; // return the newly created user
  } catch (error) {
    console.error("❌ Database error during registration:", error.message);
    throw new Error("Registration failed. Please try again later.");
  }
}

/* ****************************************
 *  Retrieve account by email (for login)
 **************************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);

    if (result.rows.length === 0) {
      return null; // no user found
    }

    return result.rows[0];
  } catch (error) {
    console.error("❌ Database error fetching account by email:", error.message);
    throw new Error("Unable to retrieve account details.");
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail
};
