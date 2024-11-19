import fs from "node:fs/promises";

export const read = async (filePath) =>
  await fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("ERROR", err);
      return;
    }

    return data;
  });

export const write = async (filePath, content) =>
  await fs.writeFile(filePath, content, "utf8", (err, data) => {
    if (err) {
      console.error("ERROR", err);
      return;
    }

    return data;
  });
