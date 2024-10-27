import apijson from "./api-json.js";
import appcontrol from "./app-control.js";
import authlogs from "./auth/session.js";

export default (packapp) => {
  apijson(packapp);
  appcontrol(packapp);
  authlogs(packapp);
};
