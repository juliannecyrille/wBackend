const {Pool} = require ('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OUR-Database', // e.g., the database where "requested_forms" table is
  password: 'P4ssword',
  port: 5432,
});

// Test database connection
// pool.connect(() =>
//   .then(() => console.log('connected nya'))
//   .catch()

module.exports = pool;