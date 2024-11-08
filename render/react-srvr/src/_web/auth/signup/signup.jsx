import React from "react";

import { DefaultCenter } from "../../../app/theme/templates";
import { Button, Card, TextField, Typography } from "@mui/material";

import { Password } from "../../../app/theme/components/repetitives";
import { $$h, $h } from "../../../app/theme/components/fluids";

import socket from "../../../app/js/socket-cli.js";
import { toast } from "react-hot-toast";

const [CONSTRASEÑA_FALTANTE, CONSTRASEÑA_DIFERENTE] = [0, 1];
let _username_ = false;
let _password_ = false;

export default Signup;

function Signup() {
  return (
    <DefaultCenter>
      <Card className="pad-10px max-w-400px">
        <form action="" onSubmit={() => false}>
          <Typography variant="h2">Crear usuario</Typography>
          <br />
          <TextField
            fullWidth
            id="username"
            type="search"
            variant="filled"
            onChange={() => check()}
            label="Nombre de usuario"
          />
          <$$h />
          <Password
            id="password-1"
            label="Contraseña"
            onChange={() => check()}
          />
          <$h />
          <Password
            id="password-2"
            onChange={() => check()}
            label="Repetir contraseña"
          />
          <$h />
          <p align="right">
            <Button variant="contained" onClick={createUser}>
              Crear
            </Button>
          </p>
        </form>
      </Card>
    </DefaultCenter>
  );
}

function check() {
  let username = get("username");
  let password = get("password-1");
  const no_check = (msg) => {
    _username_ = { state: "error", msg };
    _password_ = { state: "error", msg };
  };
  if (!username || !password) {
    no_check("Faltan datos");
    return;
  }
  socket.rebound({
    head: "signup: check info",
    emit: {
      send: () => {
        return {
          username,
          password,
        };
      },
    },
    listen: {
      procedure: ({ username, password }) => {
        _username_ = username;
        _password_ = password;
      },
    },
    unconnect: () => {
      no_check("No hay conexión con el servidor");
      socket.unconnect_default();
    },
  });
}

function get_password() {
  let password1 = get("password-1");
  let password2 = get("password-2");
  if (!password1 || !password2) {
    return CONSTRASEÑA_FALTANTE;
  }
  if (password1 != password2) {
    return CONSTRASEÑA_DIFERENTE;
  }
  return password1;
}

function get(id) {
  const e = document.getElementById(id);
  if (e) {
    const v = e.value;
    if (v) {
      return v;
    }
  }
}

function error(id) {
  const e = document.getElementById(id);
  e.classList.add("b-error");
  setTimeout(() => {
    e.classList.remove("b-error");
  }, 3000);
}

function error_pass() {
  ["password-1", "password-2"].forEach((e) => error(e));
}

function createUser() {
  let username = get("username");
  let password = get_password();
  if (!username) {
    error("username");
    return toast.error("Inserta un nombre de usuario", {
      position: "bottom-right",
    });
  }
  if (password == CONSTRASEÑA_FALTANTE) {
    error_pass();
    return toast.error("Ingrese la contraseña", {
      position: "bottom-right",
    });
  }
  if (password == CONSTRASEÑA_DIFERENTE) {
    error_pass();
    return toast.error("Las contraseñas no coinciden", {
      position: "bottom-right",
    });
  }
  if (_username_.state == "error") {
    return toast.error(_username_.msg, {
      position: "bottom-right",
    });
  }
  if (_password_.state == "error") {
    return toast.error(_password_.msg, {
      position: "bottom-right",
    });
  }
  socket.rebound({
    head: "create user",
    emit: {
      send: () => {
        return { username, password };
      },
    },
    listen: (state) => {},
  });
}
