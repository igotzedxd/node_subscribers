import express from "express";
import { read, write } from "../../../handlers/file.handler.mjs";
import { getNewUID } from "../../../misc/helpers.mjs";
import multer from "multer";
import * as mime from "mime-types";

const subRoutes = express.Router();

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/employees");
  },
  filename: function (req, file, cb) {
    let newFileName = getNewUID() + "." + mime.extension(file.mimetype);
    let ext = mime.extension(file.mimetype);

    cb(null, newFileName);
  },
});

const upload = multer({ storage: userStorage });

subRoutes.post("/api/subscriber", upload.single(""), async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) return res.json({ message: "Name and email are required" });

  let subs = await read("./lib/db/subscribers.json");
  subs = !subs.trim() ? [] : JSON.parse(subs);

  const subExists = subs.length ? subs.find((sub) => sub.email === email) : false;
  if (subExists) return res.json({ message: "Sub already exists, not added" });

  const newSub = { id: getNewUID(), name, email };
  subs = [...subs, newSub];
  await write("./lib/db/subscribers.json", JSON.stringify(subs));
  res.json({ message: "Sub added", data: newSub });
});

subRoutes.get("/api/subscriber", async (req, res) => {
  const { id } = req.body;
  let subs = await read("./lib/db/subscribers.json");
  subs = !subs.trim() ? [] : JSON.parse(subs);
  if (!subs.length) return res.json({ message: "No subs" });

  const sub = subs.find((sub) => sub.id === id);
  if (!sub) return res.json({ message: "Sub does not exist" });

  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Sub retrieved", data: sub });
});

subRoutes.put("/api/subscriber", upload.single(""), async (req, res) => {
  console.log("req.body:", req.body);
  const { id, name, email } = req.body;

  if (!id) return res.json({ message: "Sub ID is required" });

  if (!name?.length && !email?.length)
    return res.json({ message: "You're trying to clear all fields" });

  let subs = await read("./lib/db/subscribers.json");
  subs = !subs.trim() ? [] : JSON.parse(subs);

  if (!subs.length) return res.json({ message: "No subs" });

  const subIndex = subs.findIndex((sub) => sub.id === id);
  if (!(subIndex >= 0)) return res.json({ message: "Sub does not exist" });

  subs[subIndex] = {
    ...subs[subIndex],
    ...(name?.length > 0 && { name }),
    ...(email?.length > 0 && { email }),
  };

  let updatedSubs = write("./lib/db/subscribers.json", JSON.stringify(subs));
  console.log("updatedSubs:", updatedSubs);
  res.json({ message: "Sub updated", data: subs[subIndex] });
});

subRoutes.delete("/api/subscriber", upload.single(""), async (req, res) => {
  if (!req.body.id || !req.body.email) return res.json({ message: "ID and Email are required" });

  let subs = await read("./lib/db/subscribers.json");
  subs = !subs.trim() ? [] : JSON.parse(subs);
  if (!subs.length) return res.json({ message: "No subs found" });

  console.log("lowercase email:", req.body.email.toLowerCase());

  const subIndex = subs.findIndex(
    (sub) => sub.id === req.body.id && sub.email.toLowerCase() === req.body.email.toLowerCase()
  );

  if (!(subIndex >= 0)) {
    return res.json({ message: "Sub does not exist" });
  }

  subs = subs.filter((sub) => sub.id !== req.body.id);
  await write("./lib/db/subscribers.json", JSON.stringify(subs));
  res.json({ message: "Sub deleted" });
});

export default subRoutes;
