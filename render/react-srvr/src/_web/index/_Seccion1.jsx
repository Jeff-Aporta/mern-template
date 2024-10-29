import React from "react";

import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSScmds from "../../app/js/CSScmds/CSScmds";
import content from "./_content";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";

const wbrk = 700;

const url = content.Seccion1.urlImgApp;
const clss = "br-20px of-contain";
const [wmin, wmax] = [200, 250];

export default Seccion1;

function Seccion1() {
  return (
    <div className="content-container min-h-80vh d-center">
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
        <ImgRow />
        <Content />
      </Paper>
    </div>
  );

  function Content() {
    return (
      <div className="gap-40px d-flex-col">
        <Typography variant="h1">{content.Seccion1.title}</Typography>
        <ImgCol />
        <div
          className={CSScmds({
            code: `
                x<${wbrk}px?{
                  justify-content: (center,);
                }
                320px<-x->${wbrk}px{
                  gap: [10px, 30px]
                }
              `,
            clss: "d-flex",
          })}
        >
          <Button
            variant="contained"
            size="large"
            color="atentionGreen"
            href="/auth/login"
            className="ws-nowrap"
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
            href="/auth/signup"
            className="ws-nowrap"
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

}

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
            }
            y<500px?{
              display: (none,)
            }
          `,
        clss,
      })}
    />
  );
}
