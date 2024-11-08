import React from "react";

import "./scss/main.scss";

import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Footer from "./components/footer/footer.jsx";
import MenuTopUnlog from "./components/menus/unlog.jsx";

import theme from "./setup-mui.jsx";

import { $ } from "./components/fluids.jsx";

const minH = "min-h-80vh";

function Main({ children }) {
  return (
    <Themized>
      {children}
      <Toaster />
    </Themized>
  );

  function Themized({ children }) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }
}

function ContentTop({ children }) {
  return <div className={`${minH}`}>{children}</div>;
}

function ContentCenter({ children }) {
  return <div className={`${minH} d-center`}>{children}</div>;
}

function DefaultTmplt({ children }) {
  return (
    <Main>
      <MenuTopUnlog />
      <$ variant="normal" className="tw-balance">
        {children}
      </$>
      <Footer />
    </Main>
  );
}

function DefaultCenter({ children }) {
  return (
    <DefaultTmplt>
      <ContentCenter>{children}</ContentCenter>
    </DefaultTmplt>
  );
}

function Default({ children }) {
  return (
    <DefaultTmplt>
      <ContentTop>{children}</ContentTop>
    </DefaultTmplt>
  );
}

export { Default, DefaultCenter };
