import React from "react";

import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import fluidCSS from "fluid-css-lng";
import content from "./content";

import { _img } from "../../../app/theme/components/repetitives";
import { $h1, $h2, $$h, $h } from "../../../app/theme/components/fluids";

const wbrk = 700;

const url = "img/app.jpg";
const clss = "br-20px of-contain";
const [wmin, wmax] = [200, 250];

export default Seccion1;

function Seccion1() {
  return (
    <div
      className="content-container min-h-80vh d-center of-hidden p-relative"
      style={{
        background:
          "radial-gradient(circle at 90% 50%, #94004F 0%, #112 50%, #101 100%)",
      }}
    >
      <_img
        src="img/logo-dark.svg"
        className={fluidCSS()
          .lerpX([320, 1000], {
            width: [400, 700],
            bottom: [0, -100],
          })
          .end("p-absolute z-index0 soft-light mask-to-right sepia-deeppink")}
        style={{
          left: "0",
        }}
      />
      <$CardBorder
        color="deeppink"
        className={fluidCSS()
          .ltX(wbrk, { flexDirection: ["column", "row"] })
          .end(
            "content-container p-relative d-center gap-30px br-20px z-index2 pad-20px"
          )}
      >
        <ImgRow />
        <Content />
      </$CardBorder>
    </div>
  );

  function Content() {
    return (
      <div className="gap-20px d-flex-col">
        <div className="max-w-300px">
          <$h2
            className={fluidCSS()
              .btwX([700, 1000], {
                fontWeight: [400, 300, 200],
              })
              .end()}
          >
            Cattleya
          </$h2>
          <$h />
          Nos esforzamos para ser la opción favorita de nuestros clientes.
        </div>
        <ImgCol />
        <div className="d-flex jc-sb gap-10px">
          <Button
            variant="contained"
            color="atentionBlue"
            href="/auth/signup"
            className={fluidCSS().ltX(wbrk, { width: "100%" }).end("ws-nowrap")}
            startIcon={
              <i
                className={fluidCSS()
                  .ltX(wbrk, { display: "none" })
                  .lerpX([wbrk, 1000], { fontSize: [11, 13] })
                  .end("fa fa-user-edit")}
              />
            }
          >
            Registrate
          </Button>
          <Button
            variant="contained"
            color="atentionDeeppink"
            href="/auth/login"
            className={fluidCSS().ltX(wbrk, { width: "100%" }).end("ws-nowrap")}
            startIcon={
              <i
                className={fluidCSS()
                  .ltX(wbrk, { display: "none" })
                  .lerpX([wbrk, 1000], { fontSize: [11, 13] })
                  .end("fa fa-user")}
              />
            }
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }
}

function $CardBorder(props) {
  let { color = "deeppink", color1, color2 } = props;
  color1 ??= color;
  color2 ??= color;
  return (
    <Paper
      elevation={0}
      style={{ position: "relative" }}
      className="pad-5px br-20px of-hidden"
    >
      {(() => {
        if (color1 && color2) {
          return (
            <div className="rotate-left p-absolute square-1px left-50p top-50p">
              {(() => {
                if (color1) {
                  return (
                    <div
                      className="p-absolute w-200px left-0 top-0 h-max-side-window tY--100p"
                      style={{
                        background: `linear-gradient(to right, ${color1}, transparent 80%)`,
                      }}
                    />
                  );
                }
              })()}
              {(() => {
                if (color2) {
                  return (
                    <div
                      className="p-absolute w-200px right-0 top-0 h-max-side-window"
                      style={{
                        background: `linear-gradient(to left, ${color2}, transparent 80%)`,
                      }}
                    />
                  );
                }
              })()}
            </div>
          );
        }
      })()}
      <Paper {...props} />
    </Paper>
  );
}

function ImgRow() {
  return (
    <_img
      src={url}
      className={fluidCSS({
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
    <center>
      <_img
        src={url}
        className={fluidCSS()
          .gtX(wbrk, { display: "none" })
          .ltY(500, { display: "none" })
          .lerpX([320, wbrk], { width: [wmin, wmax] })
          .end(clss)}
      />
    </center>
  );
}
