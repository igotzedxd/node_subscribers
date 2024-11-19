import express from "express";
import bodyParser from "body-parser";
import { dirname } from "./misc/helpers.mjs";
import clientRoutes from "./routes/client/client.route.mjs";
import usersRoutes from "./routes/api/users/users.route.mjs";
import userRoutes from "./routes/api/user/user.route.mjs";
import subsRoutes from "./routes/api/subscribers/subscribers.route.mjs";
import subRoutes from "./routes/api/subscriber/subscriber.route.mjs";

const server = {};

const expressServer = express();
expressServer.use(bodyParser.json());

/* static files */
expressServer.use(express.static("client"));
expressServer.use(express.static("public"));

/* routes */
expressServer.use(clientRoutes);

/* API routes */
// Users
expressServer.use(usersRoutes);
expressServer.use(userRoutes);
// Subscribers
expressServer.use(subRoutes);
expressServer.use(subsRoutes);

server.run = () => {
  console.log("\n\n---------------------");
  console.log("Server Started", process.env.SERVER_PORT, process.env.SERVER_HOST);
  console.log("\n\n---------------------");

  expressServer.listen(process.env.SERVER_PORT, () => {
    console.log("Lytter på port : ", process.env.SERVER_PORT, dirname);
  });
};

export default server;
