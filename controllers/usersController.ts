import { Request, Response } from "express";
import pool from "../utils.js/pool";

const getUsers = (req: Request, res: Response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
};

const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
};

export default { getUsers, getUserById };
