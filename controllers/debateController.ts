import { Request, Response } from "express";
import pool, { postQuery } from "../utils.js/pool";

const addDebate = async (req: Request, res: Response) => {
  const {
    creator_id,
    topic,
    creator_position,
    creator_opening,
    is_political,
    days,
  } = req.body;

  try {
    const addedDebate = await postQuery("debate", {
      creator_id,
      topic,
      creator_position,
      creator_opening,
      is_political: is_political ? 1 : 0,
      days,
    });
    res.send(addedDebate);
  } catch (error) {
    console.log("error getting debates:", error);
    res.status(500).send(error);
  }
};

const getDebates = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `
    SELECT creator.username, creator.email, creator.avatar, debate.*
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

const getUnseenDebates = async (req: Request, res: Response) => {
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
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    res.send(rows);
  } catch (error) {
    console.log("error getting debate by id:", error);
    res.status(500).send(error);
  }
};

export default { addDebate, getDebates, getDebateById };
