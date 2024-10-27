import dotenv from "dotenv";
dotenv.config({ path: "_production.env" });
dotenv.config({ path: "_images.env" });

import fs from "fs";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imgs = Object.entries(process.env)
  .filter(([k, v]) => ["img", "svg"].some((prefix) => k.startsWith(prefix)))
  .reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

function ejs({ app }) {
  app.get("/view", (req, res) => {
    search({ req, res });
  });
  app.get("/view/*", (req, res) => {
    search({ req, res });
  });
}

function search({ req, res }) {
  const unview = (() => {
    const retorno = req.originalUrl.split("/").filter(Boolean);
    delete retorno[0];
    return retorno.filter(Boolean).join("/");
  })();
  console.log({ unview });
  const nodes = unview.length ? unview.split("/") : [];
  const _nodes = [...nodes];
  const last = _nodes.pop() ?? "";

  if (last.includes(".")) {
    res.sendFile(genfile(nodes));
  } else {
    inferred();
  }

  function genfile(pathArr) {
    if (typeof pathArr === "string") {
      pathArr = pathArr.split("/");
    }
    return __dirname.replace(
      join("app", "routes"),
      join("render", "react-cli-ejs", ...pathArr)
    );
  }

  function inferred() {
    return inferEJS() ?? inferJSX();
  }

  function inferEJS() {
    return inferreExt((file) => {
      res.render(file, {
        render: "source",
      });
    }, ".ejs");
  }

  function inferJSX() {
    return inferreExt((file) => {
      file = file.split("/").filter(Boolean).join("/");
      const css = false;
      const pathcss = `${file}.css`;
      if (fs.existsSync(genfile(pathcss))) {
        css = pathcss;
      }
      res.render("template", {
        render: "ejs",
        AppJSX: `/view/${file}.jsx`,
        css,

        imgs,
        title: process.env.title ?? "Untitle",
        site_name: process.env.title ?? "Unnamed Site",
        description: process.env.description ?? "Undescripted",
        image: process.env.image || "Unimage",
        icon: process.env.icon || "Unicon",
      });
    }, ".jsx");
  }

  function inferreExt(success, ext) {
    return (
      exists([..._nodes, last + ext], unview) ?? // direct
      exists([...nodes, "index" + ext], `${unview}/index`) ?? // index
      exists([...nodes, last + ext], `${unview}/${last}`) // homonim
    );

    function exists(pathRelArr, template) {
      const pathgen = genfile(pathRelArr);
      if (fs.existsSync(pathgen)) {
        success(template);
        return true;
      }
    }
  }
}

export default ejs;
