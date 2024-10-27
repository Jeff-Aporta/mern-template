import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

// Configuración de Redis
const redisClient = (() => {
  const urlRedis = process.env.url_redis;

  console.log("connect", { urlRedis });

  // Configura el cliente Redis según si `url_redis` está definido o no
  const client = urlRedis
    ? new Redis(urlRedis)
    : new Redis({
        host: "127.0.0.1",
        port: 6379,
        username: "jeff",
        password: "1234",
      });

  // Escucha eventos de error para manejar problemas de conexión
  client.on("error", (error) => {
    console.error("Error de conexión a Redis:", error);
  });

  // Escucha eventos de reconexión
  client.on("connect", () => {
    console.log("Conectado a Redis");
  });

  client.on("reconnecting", () => {
    console.log({ urlRedis });
    console.log("Intentando reconectar a Redis...");
  });

  return client;
})();

export default redisClient;
