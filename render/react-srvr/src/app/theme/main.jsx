import React from "react";

import "./main.css";

import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import MenuTopUnlog from "./components/menus/top/unlog";
import router from "../routes/route-manager";
import theme from "./setup-mui";
import SrcDepend from "../js/dependencies";

function Themized({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SrcDepend />
      {children}
    </ThemeProvider>
  );
}

function Main({ children }) {
  return (
    <Themized>
      {children}
      <Toaster />
    </Themized>
  );
}
function Default() {
  return (
    <Main>
      <MenuTopUnlog />
      <RouterProvider router={router} />
    </Main>
  );
}

export { Default };
