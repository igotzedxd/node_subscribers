import express from "express";
import { read, write } from "../../../handlers/file.handler.mjs";
import { getNewUID } from "../../../misc/helpers.mjs";

const userRoutes = express.Router();

userRoutes.get("/api/user", async (req, res) => {
  const reqUser = req.body;
  let users = await read("./lib/db/users.json");
  users = JSON.parse(users);
  const user = users.find((user) => user.name === reqUser.name);
  if (!user) return res.json({ message: "User does not exist" });

  res.setHeader("Content-Type", "application/json");
  res.json({ message: "vi vil se data", data: user });
});

userRoutes.post("/api/user", async (req, res) => {
  const newUser = req.body;
  console.log("User to add: ", newUser);

  let users = await read("./lib/db/users.json");
  users = !users.trim() ? [] : JSON.parse(users);
  const userExists = users.find((user) => user.name === newUser.name);
  if (userExists) {
    return res.json({ message: "User already exists, not added" });
  }
  const newId = getNewUID();
  console.log("New ID: ", newId);
  users = [...users, { ...newUser, id: newId, name: newUser.name }];
  write("./lib/db/users.json", JSON.stringify(users));
  res.json({ message: "User added", data: users });
});

userRoutes.put("/api/user", async (req, res) => {
  const reqUser = req.body;

  if (!reqUser.id) {
    return res.json({ message: "User ID is required" });
  }

  let users = await read("./lib/db/users.json");
  users = !users.trim() ? [] : JSON.parse(users);
  const userIndex = users.findIndex((user) => user.id === reqUser.id);

  if (userIndex < 0) {
    return res.json({ message: "User does not exist" });
  }

  users[userIndex] = { ...users[userIndex], ...reqUser };
  await write("./lib/db/users.json", JSON.stringify(users));
  res.json({ message: "User updated", data: users[userIndex] });
});

userRoutes.delete("/api/user", async (req, res) => {
  const reqUser = req.body;

  if (!reqUser.id) return res.json({ message: "User ID is required" });

  let users = await read("./lib/db/users.json");
  users = !users.trim() ? [] : JSON.parse(users);
  const userIndex = users.findIndex((user) => user.id === reqUser.id);

  if (userIndex < 0) return res.json({ message: "User does not exist" });

  users = users.filter((user) => user.id !== reqUser.id);
  await write("./lib/db/users.json", JSON.stringify(users));
  res.json({ message: "User deleted", data: users[userIndex] });
});

export default userRoutes;
