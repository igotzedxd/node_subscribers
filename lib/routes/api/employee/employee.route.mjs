import express from "express";
import { read, write } from "../../../handlers/file.handler.mjs";
import { getNewUID } from "../../../misc/helpers.mjs";
import multer from "multer";
import * as mime from "mime-types";

const empRoutes = express.Router();

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

empRoutes.post("/api/employee", upload.single("picture"), async (req, res) => {
  const { name, email } = req.body;
  const { file } = req;

  if (!name || !email) return res.json({ message: "Name and email are required" });

  let employees = await read("./lib/db/employees.json");
  employees = !employees.trim() ? [] : JSON.parse(employees);

  const empExists = employees.length
    ? employees.find((emp) => emp.email.toLowerCase() === email.toLowerCase())
    : false;
  if (empExists) return res.status(400).json({ message: "Employee already exists, not added" });

  const newEmp = { id: getNewUID(), name, email, picture: file?.filename ?? "defaultAvatar.png" };
  employees = [...employees, newEmp];
  await write("./lib/db/employees.json", JSON.stringify(employees));
  res.json({ message: "Employee added", data: newEmp });
});

empRoutes.get("/api/employee", async (req, res) => {
  const { id } = req.body;
  let employees = await read("./lib/db/employees.json");
  employees = !employees.trim() ? [] : JSON.parse(employees);
  if (!employees.length) return res.json({ message: "No employees" });

  const emp = employees.find((emp) => emp.id === id);
  if (!emp) return res.json({ message: "emp does not exist" });

  res.setHeader("Content-Type", "application/json");
  res.json({ message: "emp retrieved", data: emp });
});

empRoutes.put("/api/employee", upload.single("picture"), async (req, res) => {
  const { id, name, email } = req.body;
  const { file } = req;

  if (!id) return res.json({ message: "emp ID is required" });

  let employees = await read("./lib/db/employees.json");
  employees = !employees.trim() ? [] : JSON.parse(employees);

  if (!employees.length) return res.json({ message: "No employees" });

  const empIndex = employees.findIndex((emp) => emp.id === id);
  if (!(empIndex >= 0)) return res.json({ message: "emp does not exist" });

  employees[empIndex] = {
    ...employees[empIndex],
    ...(name?.length > 0 && { name }),
    ...(email?.length > 0 && { email }),
    picture: file?.filename ?? "defaultAvatar.png",
  };

  let updatedEmployees = await write("./lib/db/employees.json", JSON.stringify(employees));
  console.log("updatedemployees:", updatedEmployees);
  res.json({ message: "emp updated", data: employees[empIndex] });
});

empRoutes.delete("/api/employee", upload.single(""), async (req, res) => {
  if (!req.body.id && !req.body.email) return res.json({ message: "ID and Email are required" });

  let employees = await read("./lib/db/employees.json");
  employees = !employees.trim() ? [] : JSON.parse(employees);
  if (!employees.length) return res.json({ message: "No employees found" });

  const empIndex = employees.findIndex(
    (emp) => emp.id === req.body.id && emp.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (!(empIndex >= 0)) return res.json({ message: "emp does not exist" });

  employees = employees.filter((emp) => emp.id !== req.body.id);
  await write("./lib/db/employees.json", JSON.stringify(employees));
  
  res.json({ message: "emp deleted" });
});

export default empRoutes;
