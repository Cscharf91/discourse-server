import { Pool } from "pg";

const pool = new Pool({
  user: "cory",
  host: "localhost",
  database: "Discourse Development",
  password: process.env.DB_PASS,
  port: 5432,
});

const processFieldsData = (fields: {}): { fieldValues: any[], fieldKeys: string[] } => {
  const fieldKeys = Object.entries(fields).map(([key]) => key);
  const fieldValues = Object.entries(fields).map(([,value]) => value);

  return { fieldKeys, fieldValues };
}

export const postQuery = async (
  table: string,
  fields: {}
) => {
  const { fieldKeys, fieldValues } = processFieldsData(fields);

  const { rows } = await pool.query(`
  INSERT INTO ${table}
  (${fieldKeys
    .join(", ")})
  VALUES (
    ${fieldValues.map((value, index) => `$${index + 1}`).join(", ")}
  )
  RETURNING *
  `, [...fieldValues]);

  return rows[0];
};

export const getQueryByFields = async (
  table: string,
  fields: {}
) => {
  const { fieldKeys, fieldValues } = processFieldsData(fields);

  const { rows } = await pool.query(`
    SELECT *
    FROM ${table}
    WHERE ${fieldKeys.map((key, index) => {
      if (index === 0) return `${key} = $${index}`
      else return ` AND ${key} = $${index}`;
    })}
  `, [...fieldValues]);
  return rows;
}

export default pool;
