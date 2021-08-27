import { Request, Response } from "express";
import pool from "../utils.js/pool";

const getDebates = (req: Request, res: Response) => {
  pool.query(
    `
  SELECT *
  FROM debate
  `,
    (error: Error, results) => {
      if (error) {
        throw error;
      }
      res.send(results.rows);
    }
  );
};

const getDebateById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error: Error, results) => {
    if (error) {
      throw error;
    }
    res.send(results.rows);
  });
};

export default { getDebates, getDebateById };
