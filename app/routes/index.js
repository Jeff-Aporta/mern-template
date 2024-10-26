import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/logs.js";

import path from "path";

// Define __pathapp__ en tu archivo principal
global.__pathapp__ = path.resolve(); // Esto establece la ruta absoluta en la raíz de tu proyecto

// Función react
function react({ app }) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(global.__pathapp__, "client", "build", "index.html"));
  });
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(global.__pathapp__, "client", "build", "index.html"));
  });
}

// Exporta tu función
export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
