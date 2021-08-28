import { Request, Response } from "express";
import pool from "../utils.js/pool";

const getUsers = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.send(rows);
  } catch (error) {
    console.log("error getting users:", error);
    res.status(500).send(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    res.send(rows);
  } catch (error) {
    console.log("error getting user by id:", error);
    res.status(500).send(error);
  }
};

export default { getUsers, getUserById };
