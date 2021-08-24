import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config.js";
import users from "./routes/users";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", users);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});
