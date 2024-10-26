import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "../../../utils/route-manager";

import "./main.css";

import MenuTopUnlog from "./components/menus/top/unlog";

function Default() {
  return (
    <div className="app">
      <MenuTopUnlog />
      <RouterProvider router={router} />
    </div>
  );
}

export default Default;
