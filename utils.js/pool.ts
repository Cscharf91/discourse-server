import { Pool } from "pg";

const pool = new Pool({
  user: 'cory',
  host: 'localhost',
  database: 'Discourse Development',
  password: process.env.DB_PASS,
  port: 5432,
});

export default pool;