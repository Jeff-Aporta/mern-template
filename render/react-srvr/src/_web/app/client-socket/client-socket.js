import { io } from "socket.io-client";

const DEV = false;
const SOCKET_SERVER_URL = window.location.origin;

const socket = !DEV ? io(SOCKET_SERVER_URL) : "";
let _id = -1;

function emit(key, data) {
  if (!socket) {
    console.error("Socket not connected. Cannot emit");
    return;
  }
  console.log("emit", key, data);
  socket.emit(key, data);
}

function listen(key, callback) {
  if (!socket) {
    console.error("Socket not connected. Cannot listen");
    return;
  }
  socket.on(key, callback);
}

function channel(key, { listen, emit }) {
  if (!socket) {
    console.error("Socket not connected. Cannot listen");
    return;
  }
  socket.on(key, listen);
  socket.emit(key, emit);
}

function end() {
  if (!socket) {
    console.error("Socket not connected. Cannot end");
    return;
  }
  socket.disconnect();
}

const id = () => _id;

socket.on("connect", () => {
  _id = socket.id;
});

export { emit, listen, end, channel, id };