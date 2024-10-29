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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { DefaultCenter } from "../../../app/theme/templates";

import { enter, checkPassword, checkUser } from "./login.checks";

import contenido from "./login.contenido";
import CSScmds from "./../../../app/js/CSScmds/CSScmds";

export default Login;

function Login() {
  return (
    <DefaultCenter>
      <div
        className={CSScmds()
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
      className={CSScmds()
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
        className={CSScmds()
          .ltY(400, { display: [, "none"] })
          .end()}
      >
        Inicio de sesión
      </Typography>
      <div
        className={CSScmds()
          .ltY(400, { display: ["none"] })
          .lerpX([320, 500], {
            fontSize: [80, 100],
            width: [120, 200],
            height: [120, 200],
          })
          .end("circle bg-skyblue d-center")}
      >
        <FontAwesomeIcon icon={faUser} />
      </div>
    </div>
  );
}

function Password({ label, id, onChange }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      sx={{ overflow: "hidden" }}
      variant="filled"
      className="br-1100-10px"
      fullWidth
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <FilledInput
        fullWidth
        id={id}
        type={showPassword ? "text" : "password"}
        sx={{ fontSize: "20px" }}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
