import express from "express";
import { read, write } from "../../../handlers/file.handler.mjs";
import { getNewUID } from "../../../misc/helpers.mjs";

const subRoutes = express.Router();

subRoutes.get("/api/subscriber", async (req, res) => {

});

subRoutes.post("/api/subscriber", async (req, res) => {

});

subRoutes.put("/api/subscriber", async (req, res) => {

});

subRoutes.delete("/api/subscriber", async (req, res) => {

});

export default subRoutes;