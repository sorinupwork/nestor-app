import { createPool, Pool } from 'mysql2/promise';

import { createDatabaseAndTables } from './models/mysql-db';

const pool: Pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: Number(process.env.DB_PORT),
});

createDatabaseAndTables(pool);

export default pool;
