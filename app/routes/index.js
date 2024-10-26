import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/logs.js";
import path from "path";

function react({ app }) {
  // Define la ruta del archivo una sola vez
  const filePath = path.join(global.__pathapp__, "client", "build", "index.html");

  app.get("/", (req, res) => {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error enviando el archivo:", err);
        res.status(err.status).end();
      }
    });
  });

  app.get("*", (req, res) => {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error enviando el archivo:", err);
        res.status(err.status).end();
      }
    });
  });
}

// Exporta tu función
export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
