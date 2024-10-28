import React from "react";

import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSScmds from "../../app/js/CSScmds";
import content from "./index.content";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";

const wbrk = 700;

export default Seccion1;

function Seccion1() {
  return (
    <div className="h-80vh d-center">
      <Paper
        elevation={1}
        className={CSScmds({
          code: `
              x<${wbrk}px?{
                flex-direction: (column, row);
              }
            `,
          clss: "content-container d-center gap-30px br-20px",
        })}
      >
        <LogoApp />
        <Content />
      </Paper>
    </div>
  );

  function Content() {
    return (
      <div className="gap-40px d-flex-col">
        <Typography variant="h1">{content.Seccion1.title}</Typography>
        <div
          className={CSScmds({
            code: `
                x<${wbrk}px?{
                  justify-content: (center,);
                } 
              `,
            clss: "d-flex gap-30px",
          })}
        >
          <Button
            variant="contained"
            size="large"
            color="atentionGreen"
            startIcon={
              <FontAwesomeIcon
                icon={faUser}
                className={CSScmds({ code: `x<${wbrk}px?{display:(none,)}` })}
              />
            }
          >
            Iniciar sesión
          </Button>
          <Button
            variant="contained"
            size="large"
            color="atentionBlue"
            startIcon={
              <FontAwesomeIcon
                icon={faUserEdit}
                className={CSScmds({ code: `x<${wbrk}px?{display:(none,)}` })}
              />
            }
          >
            Registrate
          </Button>
        </div>
      </div>
    );
  }

  function LogoApp() {
    const url = content.Seccion1.urlImgApp;
    const clss = "br-20px of-contain";
    const wbrk = 700;
    const [wmin, wmax] = [200, 250];

    return (
      <>
        <ImgCol />
        <ImgRow />
      </>
    );

    function ImgCls({ className }) {
      return <img src={url} className={className} />;
    }

    function ImgRow() {
      return (
        <ImgCls
          className={CSScmds({
            code: `
              x<${wbrk}px?{
                display: (none,);
              } 
              ${wbrk}px<-x->1000px?{
                width: [${wmin}px, ${wmax}px];
              }
            `,
            clss,
          })}
        />
      );
    }

    function ImgCol() {
      return (
        <ImgCls
          className={CSScmds({
            code: `
                x<${wbrk}px?{
                  display: (,none);
                  width: ${wmax}px;
                  margin-top: 20px;
                } 
              `,
            clss,
          })}
        />
      );
    }
  }
}
