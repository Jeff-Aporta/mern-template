import "./unlog.css";

import { Button, Link, Paper, Typography } from "@mui/material";

import { _img } from "../repetitives";
import fluidCSS from "fluid-css-lng";

const hideIcon = 500;
const wbrk = 600;

const claseBoton = fluidCSS()
  .btwX([600, 1000], { scale: [0.8, 0.9, 1] })
  .end("to-right-center ws-nowrap");

const claseIconoBoton = fluidCSS()
  .ltX(hideIcon, { display: "none" })
  .lerpX([hideIcon, 1000], { fontSize: [10, 13] })
  .end();

export default Menu;

function Menu() {
  const { pathname } = window.location;
  const inLogin = pathname.toLowerCase().endsWith("/auth/login");

  return (
    <Paper
      elevation={0}
      className={fluidCSS()
        .lerpX([400, 1000], { padding: [10, 20] })
        .end("menu-top d-flex jc-sb ai-c")}
    >
      <Link color="inherit" underline="none" href="/" className="d-center bright-hover-1-5 gap-10px c-pointer">
        <_img
          src="img/logo-dark.svg"
          className={fluidCSS()
            .lerpX([400, 1000], { width: [30, 50] })
            .end()}
        />
        <Typography
          className={fluidCSS()
            .lerpX([400, 1000], { fontSize: [20, 30] })
            .end()}
        >
          Cattleya
        </Typography>
      </Link>
      <div>{inLogin ? <ButtonSignup /> : <ButtonLogin />}</div>
    </Paper>
  );
}

function ButtonSignup() {
  return (
    <Button
      variant="contained"
      color="atentionBlue"
      href="/auth/signup"
      className={claseBoton}
      startIcon={
        <i
          className={fluidCSS()
            .ltX(wbrk, { display: "none" })
            .end("fa fa-user-edit " + claseIconoBoton)}
        />
      }
    >
      Registrate
    </Button>
  );
}

function ButtonLogin() {
  return (
    <Button
      variant="contained"
      color="atentionGreen"
      href="/auth/login"
      className={claseBoton}
      startIcon={
        <i
          className={fluidCSS()
            .ltX(wbrk, { display: "none" })
            .end("fa fa-user " + claseIconoBoton)}
        />
      }
    >
      Iniciar sesión
    </Button>
  );
}
