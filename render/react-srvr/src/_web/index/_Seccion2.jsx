import React from "react";

import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import CSScmds from "../../app/js/CSScmds/CSScmds";
import content from "./_content";

export default Seccion2;

const wbrk = 870;
const [hmin, hmax] = [200, 300];

const clsH = `
      400px<-y->600px?{
        max-height: [${hmin}px, ${hmax}px];
      }
`;

function Seccion2() {
  return (
    <Paper
      elevation={1}
      className={CSScmds({
        code: `
          x<${wbrk}px?{
            display: (,flex);
            justify-content: (,center);
            align-content: (,center);
          }
        `,
        clss: "content-container",
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
        `,
        clss: "content-container gap-30px",
      })}
    >
      <ImgBanner />
      {/* <ImgCol /> */}
      <ImgRow />
      <Content />
    </div>
  );
}

function Content() {
  return (
    <div>
      <Typography
        variant="h1"
        className={CSScmds({
          code: `
            600px<x<${wbrk}px?{
              display: (,none,);
            }
          `,
        })}
      >
        {content.Seccion2.title}
      </Typography>
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

function ImgBanner() {
  return (
    <img
      alt=""
      src={content.Seccion2.bannerurlImg}
      className={CSScmds({
        code: `
          600px<x<${wbrk}px?{
            display: (none,,none);
          }
          ${clsH} 
        `,
        clss: "img-col of-contain w-90vw",
      })}
    />
  );
}

function ImgCol() {
  return (
    <img
      alt=""
      src={content.Seccion2.urlImg}
      className={CSScmds({
        code: `
          400px<x<${wbrk}px?{
            display: (none,,none);
          }
          400px<-x->${wbrk}px?{
            max-width: [150px, 250px];
          } 
          ${clsH} 
        `,
        clss: "img-col of-contain oc-lt",
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
          display: (none,);
        }
        900px<-x->1100px?{
          max-width: [200px, 300px];
        }
        ${clsH} 
      `,
        clss: "of-contain",
      })}
    />
  );
}
