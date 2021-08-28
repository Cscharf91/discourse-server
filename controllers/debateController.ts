import { Request, Response } from "express";
import pool from "../utils.js/pool";

const getDebates = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `
    SELECT creator.username, creator.email AS creator, debate.*
    FROM debate
    INNER JOIN users creator
    ON creator.id = debate.creator_id
    `
    );
    res.send(rows);
  } catch (error) {
    console.log("error getting debates:", error);
    res.status(500).send(error);
  }
};

const getDebateById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.send(rows);
  } catch (error) {
    console.log("error getting debate by id:", error);
    res.status(500).send(error);
  }

};

export default { getDebates, getDebateById };
