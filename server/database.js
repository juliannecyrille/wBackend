const {Pool} = require ('pg')

const pool = new Pool({
  user: 'postgres',
  host: '192.168.55.117',
  database: 'Outgoing', // database ni antot
  password: 'P4ssword',
  port: 5432,
});

// Test database connection
// pool.connect(() =>
//   .then(() => console.log('connected nya'))
//   .catch()
pool.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error:', err));

module.exports = pool;