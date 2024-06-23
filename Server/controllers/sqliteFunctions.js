const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create a new database instance
const dbPath = path.resolve(__dirname, "messages.db"); // Path to your SQLite database file
const db = new sqlite3.Database(dbPath);

// Function to run SQL queries
function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to create database tables and prepare queries
async function initializeDatabase() {
  await runQuery(
    `
      CREATE TABLE IF NOT EXISTS a_USENET (
          agroup TEXT,
          id_mes TEXT,
          fm TEXT,
          sub TEXT,
          ref TEXT,
          body TEXT,
          bytes TEXT,
          lines TEXT,
          n_mes TEXT,
          d_mes TEXT,
          i_mes TEXT
      )
    `,
    []
  );
}

// Function to fetch data from a dataset
async function fetchData(agroup) {
  let sql = `
      SELECT
          sub,
          fm,
          d_mes,
          n_mes,
          id_mes
      FROM
          a_USENET
      WHERE
          agroup = ?
      ORDER BY
          sub, i_mes
  `;
  let params = [agroup];
  return await runQuery(sql, params);
}

// Example usage of functions
async function main() {
  await initializeDatabase();

  // Example fetching data for a specific group
  let agroup = "it.hobby.fai-da-te";
  let messages = await fetchData(agroup);
  console.log("Messages:", messages);
}

main().catch((err) => console.error("Error:", err));

// Close the database connection when done (optional)
// db.close();

module.exports = {
  runQuery,
  initializeDatabase,
  fetchData,
};
