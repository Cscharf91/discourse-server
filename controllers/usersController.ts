import { Request, Response } from "express";
import pool from "../utils.js/pool";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserLogin {
  username?: string;
  email?: string;
  password: string;
}

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

const register = async (req: Request, res: Response) => {
  const { email, username, password }: UserLogin = req.body;
  try {
    [
      body("username").trim().isLength({ min: 4 }).escape(),
      body("email").trim().isLength({ min: 6 }).isEmail().escape(),
      body("password").isLength({ min: 6 }).escape(),
    ];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ messages: errors.array() });
    }

    const {
      rows: emailExistsRow,
    } = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const [emailExists] = emailExistsRow;
    if (emailExists)
      return res.status(400).json({ messages: "Email already exists" });

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username.toLowerCase(), email.toLowerCase(), hashedPass]
    );
    const {
      rows: userRow,
    } = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const [user] = userRow;

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({ token, user });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password }: UserLogin = req.body;

  const {
    rows,
  } = await pool.query(
    "SELECT * FROM users WHERE email = $1 OR username = $2",
    [username.toLowerCase(), username.toLowerCase()]
  );
  let [user] = rows;

  if (!user)
    return res.status(400).json({ message: "There was an issue logging in" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "There was an issue logging in" });

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({ token, user });
};

export default { getUsers, getUserById, register, login };
