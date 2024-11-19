/* import path from "node:path";
 */ import { v4 as uuidv4 } from "uuid";
import url from "node:url";

export const dirname = url.fileURLToPath(new URL("../../", import.meta.url));

export const getNewUID = () => {
  return uuidv4();
};
