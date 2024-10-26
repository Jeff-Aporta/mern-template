function snake_case(str) {
  if (typeof str !== "string") {
    throw new TypeError("El valor proporcionado no es una cadena.");
  }
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function setCOL(obj, COL, value) {
  if (typeof COL !== "string") {
    throw new TypeError("La clave proporcionada no es una cadena.");
  }
  COL = snake_case(COL);
  const key = Object.keys(obj).find((k) => snake_case(k) === COL);
  obj[key] = value;
}

function getCOL(obj, COL) {
  if (typeof COL !== "string") {
    throw new TypeError("La clave proporcionada no es una cadena.");
  }
  COL = snake_case(COL);
  const key = Object.keys(obj).find((k) => snake_case(k) === COL);
  return obj[key];
}

global.snake_case = snake_case;
global.getCOL = getCOL;
global.setCOL = setCOL;

global.runPrototypes = true;

export default "LOADED >> utils.js";
