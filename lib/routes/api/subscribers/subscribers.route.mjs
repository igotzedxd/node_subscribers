import express from "express";
import { read } from "../../../handlers/file.handler.mjs";

const subsRoutes = express.Router();

subsRoutes.get("/api/subscribers", async (req, res) => {});

export default subsRoutes;
