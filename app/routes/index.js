import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/session.js";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import ejs from "./ejs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function react({ app }) {
  app.get("*", (req, res, next) => {
    res.sendFile(
      __dirname.replace(
        join("app", "routes"),
        join("render", "react-srvr", "build", "index.html")
      )
    );
  });
}

export default (packapp) => {
  Object.assign(packapp, {
    __dirname,
    __filename,
  });
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  ejs(packapp);
  react(packapp);
};
