import { io } from "socket.io-client";
import { toast } from 'react-hot-toast';

export default new (class {
  _id = -1;
  #socket = io(window.location.origin);
  #listeners = [];
  #emits = [];
  constructor(props = {}) {
    Object.assign(this, props);

    this.#socket.on("connect", () => {
      this.rebound({
        emit: {
          head: "ping",
          send: () => {
            this.ping = Date.now();
          }
        },
        listen: {
          head: "pong",
          procedure: () => {
            console.log("ping", Date.now() - this.ping, "ms");
          }
        }
      })
    });

    this.#socket.on("disconnect", (reason) => {
      // console.log("Desconectado:", reason);
      if (this.onDisconnect) {
        this.onDisconnect(reason);
      }
    });

    this.#socket.on("connect_error", (error) => {
      // console.error("Error de conexión:", error);
      if (this.onConnectError) {
        this.onConnectError(error);
      }
    });

    this.#socket.on("connect_timeout", (timeout) => {
      // console.error("Tiempo de conexión agotado:", timeout);
      if (this.onConnectTimeout) {
        this.onConnectTimeout(timeout);
      }
    });

    this.#socket.on("reconnect", (attemptNumber) => {
      // console.log("Reconectado después de", attemptNumber, "intentos");
      if (this.onReconnect) {
        this.onReconnect(attemptNumber);
      }
    });

    this.#socket.on("reconnect_attempt", (attemptNumber) => {
      // console.log("Intentando reconectar:", attemptNumber);
      if (this.onReconnectAttempt) {
        this.onReconnectAttempt(attemptNumber);
      }
    });

    this.#socket.on("reconnect_error", (error) => {
      // console.error("Error al reconectar:", error);
      if (this.onReconnectError) {
        this.onReconnectError(error);
      }
    });

    this.#socket.on("reconnect_failed", () => {
      // console.error("Fallaron todos los intentos de reconexión");
      if (this.onReconnectFailed) {
        this.onReconnectFailed();
      }
    });
  }

  get id() {
    return this.#socket.id;
  }
  get connected() {
    return this.#socket.connected;
  }

  #exec({
    connect,
    unconnect = this.unconnect_default
  } = {}) {
    if (this.connected) {
      connect();
    } else {
      unconnect();
    }
    return this;
  }

  get unconnect_default(){
    toast.error("ERROR: no hay conexión con el servidor", {
      position: "bottom-right",
    });
  }

  replit(head) {
    const emit = this.#emits.find(e => e.head == head);
    if (emit) {
      let { head, send, unconnect } = emit;
      return this.#exec({
        connect: () => this.#socket.emit(head, send()),
        unconnect,
      });
    } else {
      console.log("No emit found for", head);
      return this;
    }
  }

  emit(props) {
    let { head, send, unconnect } = props;
    if (typeof props == 'string') {
      head = props;
    }
    if (!head) {
      console.log("Bad structure to emit, need head", props);
      return this;
    }
    head = head.toLowerCase();
    if (typeof send != 'function') {
      console.log('send is not a function', send, "sending 0");
      send = () => 0;
    }
    const i = this.#emits.indexOf(this.#emits.find(e => e.head == head));
    const o = { head, send, unconnect };
    if (i >= 0) {
      this.#emits[i] = o;
    } else {
      this.#emits.push(o);
    }
    return this.#exec({
      connect: () => this.#socket.emit(head, send()),
      unconnect,
    });
  }

  listen({ head, procedure, unconnect }) {
    if (head && procedure && !this.#listeners.find(h => h == head)) {
      head = head.toLowerCase();
      this.#listeners.push(head);
      return this.#exec({
        connect: () => this.#socket.on(head, procedure),
        unconnect,
      });
    }
    return this;
  }

  rebound({ head, emit={}, listen, unconnect }) {
    return this.#exec({
      connect: () => {
        this.emit({ head, unconnect, ...emit });
        this.listen({ head, unconnect, ...listen });
      },
      unconnect
    });
  }

  end() {
    return this.#exec({
      connect: () => this.#socket.disconnect()
    });
  }
})();
