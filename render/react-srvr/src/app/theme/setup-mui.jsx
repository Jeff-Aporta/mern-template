import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const themename = localStorage.getItem("theme") ?? "dark";

const isThemeDark = themename === "dark";

let palette = (() => {
  const white = {
    main: "#fff",
    contrastText: "#000",
  };
  const black = {
    main: "#000",
    contrastText: "#fff",
  };
  const contrastText = isThemeDark ? "#fff" : "#000";
  const uncontrastText = isThemeDark ? "#000" : "#fff";
  return {
    primary: {
      main: "#1E90FF",
      contrastText,
    },
    secondary: {
      main: isThemeDark ? "#387FC7" : "#ccccff",
      contrastText,
    },
    success: {
      main: "#32CD32",
      contrastText,
    },
    atentionBlue: {
      main: "#00BFFF",
      contrastText: uncontrastText,
    },
    atentionGreen: {
      main: "#00FA9A",
      contrastText: uncontrastText,
    },
    white,
    black,
    contrast: isThemeDark ? white : black,
    uncontrast: isThemeDark ? black : white,
  };
})();

const typography = {
  fontSize: 12,
  button: {
    textTransform: "none",
  },
};

const theme = responsiveFontSizes(
  isThemeDark
    ? createTheme({
        typography,
        palette: {
          mode: "dark",
          background: {
            default: "#03030f",
            paper: "#05051f",
          },
          ...palette,
        },
      })
    : createTheme({
        typography,
        palette: {
          mode: "light",
          ...palette,
        },
      })
);

export default theme;
