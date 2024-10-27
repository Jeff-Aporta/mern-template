import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./utils/theme/setup-mui";
import ThemeV1 from "./utils/theme/v1/main";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ThemeV1 />
    <Toaster />
  </ThemeProvider>
);
