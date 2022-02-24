//https://node-postgres.com/guides/project-structure
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // connectionString: process.env.PG_URI,
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: 'gitgood',
  password: process.env.PSQL_PW,
  port: process.env.PSQL_PORT
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
