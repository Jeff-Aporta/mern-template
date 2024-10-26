import apijson from "./api-json.js"; 
import appcontrol from "./app-control.js"; 
import authlogs from "./auth/logs.js"; 
import path from "path";

function react({ app }) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__pathapp__, "client/build", "index.html"));
  });
  app.get("*", (req, res) => {
    res.sendFile(path.join(__pathapp__, "client/build", "index.html"));
  });
}

export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
  react(packapp);
};
