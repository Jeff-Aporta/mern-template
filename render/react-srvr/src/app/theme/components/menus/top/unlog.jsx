import "./unlog.css";

import { Button, Paper } from "@mui/material";

import { LogoBanner, Logo404 } from "../../logos";

export default () => {
  const { pathname } = window.location;
  const inLogin = pathname.toLowerCase().endsWith("/unlog/login");

  return (
    <Paper elevation={0} className="menu-top">
      <LogoBanner className="bright-hover" />
      <div className="right">
        {inLogin ? <ButtonSignup /> : <ButtonLogin />}
      </div>
    </Paper>
  );

  function ButtonSignup() {
    return (
      <Button
        variant="contained"
        color="atentionBlue"
        endIcon={<i className="fa fa-user-edit" />}
        href="/unlog/signup"
      >
        <span className="ab--tt-uppercase">Registrate</span>
      </Button>
    );
  }

  function ButtonLogin() {
    return (
      <Button
        endIcon={<i className="fa fa-user" />}
        variant="contained"
        color="atentionGreen"
        href="/unlog/login"
      >
        <span>Iniciar sesión</span>
      </Button>
    );
  }
};
