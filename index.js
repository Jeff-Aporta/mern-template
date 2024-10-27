import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketiomanager from "./app/sockets/sockets.js";
import cors from "cors";
import path from "path";
import routes from "./app/routes/index.js";
import pg from "./app/sql/pg/index.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors()); // Permitir solicitudes de diferentes dominios
app.set("port", port);
app.use(express.json()); // Para parsear JSON
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "render", "react-cli-ejs"));
app.use(express.static(path.join("render", "react-srvr", "build")));
app.use(express.static(path.join("render", "react-cli-ejs")));

const packexpress = { app, pg, server, io };
routes(packexpress);
socketiomanager(packexpress);

server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
