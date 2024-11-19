import express from "express";
import { read } from "../../../handlers/file.handler.mjs";

const usersRoutes = express.Router();

/* CRUD */
// GET READ
// POST CREATE
// PUT UPDATE
// DELETE DELETE

usersRoutes.get("/api/users", async (req, res) => {
  let users = await read("./lib/db/users.json");
  users = JSON.parse(users);
  console.log(users);
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "vi vil se data", data: users });
});

export default usersRoutes;
