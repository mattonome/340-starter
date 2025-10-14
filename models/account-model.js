/******************************************
 * Account Model
 ******************************************/
const pool = require("../database/");

/******************************************
 * Register a New Account
 ******************************************/
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
      account_password,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error registering account:", error.message);
    return null;
  }
}

/******************************************
 * Get Account by Email
 ******************************************/
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ No matching email found:", error.message);
    return null;
  }
}

/******************************************
 * Exports
 ******************************************/
module.exports = {
  registerAccount,
  getAccountByEmail,
};
