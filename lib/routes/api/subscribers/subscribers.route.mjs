import express from "express";
import { read } from "../../../handlers/file.handler.mjs";

const subsRoutes = express.Router();

subsRoutes.get("/api/subscribers", async (req, res) => {
  let subs = await read("./lib/db/subscribers.json");
  subs = !subs.trim() ? [] : JSON.parse(subs);

  if (subs.length === 0) return res.json({ message: "No subscribers", data: subs });

  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Alle subscribers", data: subs });
});

export default subsRoutes;
