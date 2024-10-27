import tools from "./channels/tools.js";

export default ({ io }) => {
  io.on("connection", function (socket) {
    tools({ io, socket });
    setTimeout(() => {
      io.to(socket.id).emit("msg", "Este es un mensaje de prueba");
    }, 1000);
  });
};
