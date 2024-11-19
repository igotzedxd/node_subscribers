import * as dotenv from "dotenv";
import server from "./lib/server.mjs";
dotenv.config({ path: ".env.local", override: true });

/* const application = {};

application.init = () => {
  console.log("init app", process.env.SERVER_PORT);
  server.run();
};

application.init(); */

(() => {
  console.log("init app", process.env.SERVER_PORT);
  server.run();
})();
