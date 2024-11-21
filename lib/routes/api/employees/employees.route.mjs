import express from "express";
import { read } from "../../../handlers/file.handler.mjs";

const empsRoutes = express.Router();

empsRoutes.get("/api/employees", async (req, res) => {;

  let emps = await read("./lib/db/employees.json");
  emps = !emps.trim() ? [] : JSON.parse(emps);

  if (emps.length === 0) return res.json({ message: "No employees", data: emps });

  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Alle employees", data: emps });
});

export default empsRoutes;
