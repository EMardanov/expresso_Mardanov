import mariadb from 'mariadb';
import secrets from './secrets.js';

const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

export default pool;