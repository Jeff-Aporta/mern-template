import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketiomanager from "./app/server-socket/server-socket.js";
import cors from "cors";
import path from "path";
import routes from "./app/routes/index.js";
// import pg from "./app/sql/pg/index.js";
let pg = 0;

global.__pathapp__ = new URL(".", import.meta.url).pathname
  .split("/")
  .filter(Boolean)
  .join("/");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors()); // Permitir solicitudes de diferentes dominios
app.use(express.json()); // Para parsear JSON
app.use(express.static(path.join(global.__pathapp__, "client/build")));
app.set("port", port);

const packexpress = { app, pg, server, io };
routes(packexpress);
socketiomanager(packexpress);

server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
