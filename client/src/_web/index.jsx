import React, { useEffect, useState } from "react";
import { emit, listen, end, channel, id } from "./app/client-socket/client-socket";

const Index = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    listen("msg", (data) => {
      setMessage(data);
    });
    return () => {
      end();
    };
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  return (
    <div>
      <h1>Chat</h1>
      <p>{message}</p>
      <h1>ID</h1>
      <p>{id()}</p>
    </div>
  );
};

export default Index;
