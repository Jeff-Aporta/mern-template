import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/session.js";

// Importar el módulo path
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const index = __dirname.replace(
  join("app", "routes"),
  join("client", "build", "index.html")
);

function react({ app }) {
  app.get("*", (req, res, next) => {
    res.sendFile(index);
  });
}

export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
