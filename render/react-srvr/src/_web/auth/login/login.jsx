import React from "react";

import {
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
  Typography,
  Link,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { DefaultCenter } from "../../../app/theme/templates";

import { enter, checkPassword, checkUser } from "./login.checks";

import contenido from "./login.contenido";
import fluidCSS from "fluid-css-lng";

import { Password } from "../../../app/theme/components/repetitives";

export default Login;

function Login() {
  return (
    <DefaultCenter>
      <div
        className={fluidCSS()
          .lerpX([320, 500], {
            padding: [5, 20],
          })
          .end()}
      >
        <CardLogin />
      </div>
    </DefaultCenter>
  );
}

function CardLogin() {
  return (
    <Paper
      className={fluidCSS()
        .lerpX([320, 800], {
          width: [280, 400],
          padding: [10, 30],
        })
        .end("d-inline-block br-10px")}
    >
      <form action="" onSubmit={() => false}>
        <IconUser />
        <br />
        <InputsForm />
        <ForgotPass />
        <EndForm />
      </form>
    </Paper>
  );
}

function ForgotPass() {
  return (
    <>
      <br />
      <br />
      <Link>{contenido.forgot.text}</Link>
      <br />
    </>
  );
}

function EndForm() {
  return (
    <div align="right">
      <Button color="primary" variant="contained" size="large" onClick={enter}>
        {contenido.enter.text}
      </Button>
      <br />
      <br />
      <br />
      <div>
        <Typography variant="span" color="gray">
          {contenido.register.prefix}
        </Typography>{" "}
        <Link href="/auth/signup">{contenido.register.text}</Link>
      </div>
    </div>
  );
}

function InputsForm() {
  return (
    <>
      <TextField
        fullWidth
        id="username"
        label={contenido.user.text}
        type="search"
        variant="filled"
        onChange={checkUser}
      />
      <br />
      <br />
      <Password
        onChange={checkPassword}
        id="password"
        label={contenido.password.text}
      />
    </>
  );
}

function IconUser() {
  return (
    <div className="d-center fw-bolder">
      <Typography
        variant="h3"
        className={fluidCSS()
          .ltY(400, { display: [, "none"] })
          .end()}
      >
        Inicio de sesión
      </Typography>
      <div
        className={fluidCSS()
          .ltY(400, { display: ["none"] })
          .lerpX([320, 500], {
            fontSize: [80, 100],
            width: [120, 200],
            height: [120, 200],
          })
          .end("circle bg-skyblue d-center")}
      >
        <i className="fa fa-user" />
      </div>
    </div>
  );
}
