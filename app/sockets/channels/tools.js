export default (socketio) => {
  const { socket, io } = socketio;
  channel({
    listen: {
      head: "get sockets connections",
    },
    emit: {
      head: "sockets connections",
      send: () => Array.from(io.sockets.sockets.keys())
    },
    socketio
  });
  channel({
    listen: {
      head: "ping",
    },
    emit: {
      head: "pong"
    },
    socketio
  });
};


function channel({ head, listen, emit, socketio: { socket, io } }) {
  if (head && typeof head === "string") {
    listen.head ??= head;
    emit.head ??= head;
  }
  if (listen && listen.head && typeof listen.head == "string") {
    listen.procedure ??= () => 0;
    socket.on(listen.head, (props = {}) => {
      listen.procedure(props);
      if (emit) {
        if (emit.head && typeof emit.head === 'string') {
          emit.send ??= () => undefined;
          io.to(socket.id).emit(
            emit.head,
            emit.send()
          );
        } else {
          console.error('Invalid emit configuration', emit);
        }
      }
    });
  } else {
    console.error('Invalid channel configuration', listen);
  }
}