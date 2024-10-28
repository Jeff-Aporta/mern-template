import React from "react";

import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSScmds from "../../app/js/CSScmds";
import content from "./index.content";

export default Seccion2;

const wbrk = 870;
const [wmin, wmax] = [250, 300];

function Seccion2() {
  return (
    <Paper
      elevation={1}
      className={CSScmds({
        code: `
            x<${wbrk}px?{
              min-height: (90vh, 60vh);
            }
          `,
        clss: "d-center",
      })}
    >
      <ContentContainer />
    </Paper>
  );
}

function ContentContainer() {
  return (
    <div
      className={CSScmds({
        code: `
              x<${wbrk}px?{
                flex-direction: (column,);
              }
              700px<x<1100px?{
                width: (100%, 80%, 60%);
              } 
            `,
        clss: "content-container d-flex gap-30px",
      })}
    >
      <ImgCol />
      <Content />
      <ImgRow />
    </div>
  );
}

function Content() {
  return (
    <div>
      <Typography variant="h1">{content.Seccion2.title}</Typography>
      <br />
      <Typography className="tw-balance">
        {content.Seccion2.text.map((e, i, arr) => {
          const sep = (
            <>
              <br />
              <br />
            </>
          );
          return (
            <span key={i}>
              {e}
              {i < arr.length - 1 ? sep : ""}
            </span>
          );
        })}
      </Typography>
    </div>
  );
}

function ImgCol() {
  return (
    <img
      alt=""
      src={content.Seccion2.urlImg}
      className={CSScmds({
        code: `
          x<${wbrk}px?{
            display: (,none);
            margin: 0 auto 25px auto;
          }
          400px<-x->${wbrk}px?{
            width: [${wmin}px, ${wmax}px];
          } 
        `,
        clss: "of-contain",
      })}
    />
  );
}

function ImgRow() {
  return (
    <img
      src={content.Seccion2.urlImg}
      alt=""
      className={CSScmds({
        code: `
        x<870px?{
          display: (none,)
        }
        900px<-x->1100px?{
          width: [${wmin}px, ${wmax}px];
        } 
      `,
        clss: "of-contain",
      })}
    />
  );
}
