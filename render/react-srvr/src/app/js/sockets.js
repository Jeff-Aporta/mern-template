import { io } from "socket.io-client";

const SOCKET_SERVER_URL = window.location.origin;

const socket = io(SOCKET_SERVER_URL);
let _id = -1;

const id = () => _id;

const cascada = new (class {
  constructor() {
    this.emit = emit;
    this.listen = listen;
    this.channel = channel;
    this.end = end;
  }
})();

function exec({ connect, unconnect }) {
  if (socket.connected) {
    connect();
  } else {
    unconnect();
  }
  return cascada;
}

function emit(key, data) {
  return exec({
    connect: () => console.log("Socket not connected. Cannot emit"),
    unconnect: () => socket.emit(key, data),
  });
}

function listen(key, callback) {
  return exec({
    connect: () => console.log("Socket not connected. Cannot listen"),
    unconnect: () => socket.on(key, callback),
  });
}

function channel(key, { emit, listen }) {
  return exec({
    connect: () => console.log("Socket not connected. Cannot create channel"),
    unconnect: () => {
      socket.on(key, listen);
      socket.emit(key, emit);
    },
  });
}

function end() {
  return exec({
    connect: () => socket.disconnect(),
    unconnect: () => console.log("Socket not connected. Cannot end"),
  });
}

socket.on("connect", () => {
  _id = socket.id;
  cascada?.connect?.();
});

socket.on("disconnect", (reason) => {
  // console.log("Desconectado:", reason);
  cascada?.disconnect?.(reason);
});

socket.on("connect_error", (error) => {
  // console.error("Error de conexión:", error);
  cascada?.disconnect?.(error);
});

socket.on("connect_timeout", (timeout) => {
  // console.error("Tiempo de conexión agotado:", timeout);
  cascada?.connect_timeout?.(timeout);
});

socket.on("reconnect", (attemptNumber) => {
  // console.log("Reconectado después de", attemptNumber, "intentos");
  cascada?.reconnect?.(attemptNumber);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  // console.log("Intentando reconectar:", attemptNumber);
  cascada?.reconnect_attempt?.(attemptNumber);
});

socket.on("reconnect_error", (error) => {
  // console.error("Error al reconectar:", error);
  cascada?.reconnect_error?.(error);
});

socket.on("reconnect_failed", () => {
  // console.error("Fallaron todos los intentos de reconexión");
  cascada?.reconnect_failed?.();
});

export { emit, listen, end, channel, id, cascada };
