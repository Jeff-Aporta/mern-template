import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/logs.js";

import path from "path";

function react({ app }) {
  app.get("/", (req, res) => {
    const file = path.join(global.__pathapp__, "client", "build", "index.html");
    console.log({ file });
    res.sendFile(file);
  });

  app.get("*", (req, res) => {
    const file = path.join(global.__pathapp__, "client", "build", "index.html");
    console.log({ file });
    res.sendFile(file);
  });
}

// Exporta tu función
export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
