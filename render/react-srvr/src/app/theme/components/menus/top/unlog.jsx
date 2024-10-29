import "./unlog.css";

import { Button, Paper } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";

import { LogoBanner } from "../../logos";
import CSScmds from "../../../../js/CSScmds/CSScmds";

const hideIcon = 500;

const claseBoton = CSScmds({
  code: `600px>x>1000px?{scale:(0.8,0.9,1)}`,
  clss: "to-right-center ws-nowrap",
});

const claseIconoBoton = CSScmds({ code: `x<${hideIcon}px?{display:(none,)}` });

export default Menu;

function Menu() {
  const { pathname } = window.location;
  const inLogin = pathname.toLowerCase().endsWith("/auth/login");

  return (
    <Paper elevation={0} className="menu-top">
      <LogoBanner
        width={250}
        className={CSScmds({
          code: `
            400px<-x->1000px?{
             width:[150px, 250px];
            }
          `,
          clss: "bright-hover-1-5",
        })}
      />
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
        <FontAwesomeIcon icon={faUserEdit} className={claseIconoBoton} />
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
      startIcon={<FontAwesomeIcon icon={faUser} className={claseIconoBoton} />}
    >
      Iniciar sesión
    </Button>
  );
}
