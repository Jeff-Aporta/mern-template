import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/logs.js";

import path from "path";

function react({ app }) {
  app.get("/", (req, res) => {
    const file = path.join("client", "build", "index.html");
    console.log({ file });
    res.sendFile(file, { root: global.__pathapp__ });
  });

  app.get("*", (req, res) => {
    const file = path.join("client", "build", "index.html");
    console.log({ file });
    res.sendFile(file, { root: global.__pathapp__ });
  });
}

// Exporta tu función
export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
