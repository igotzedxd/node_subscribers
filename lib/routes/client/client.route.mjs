import express from "express";
import path from "node:path";
import { dirname } from "../../misc/helpers.mjs";

const clientRoutes = express.Router();

clientRoutes.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(dirname, "/", "client", "index.html"));
});

export default clientRoutes;
