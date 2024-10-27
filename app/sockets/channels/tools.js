export default ({ io, socket }) => {
  socket.on("get sockets connections", () => {
    io.to(socket.id).emmit(
      "get sockets connections",
      Array.from(io.sockets.sockets.keys())
    );
  });
};
