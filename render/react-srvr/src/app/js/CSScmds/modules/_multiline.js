export default soportarMultilinea;

function soportarMultilinea({code}) {
  const abrirAgrupacion = "{";
  const cerrarAgrupacion = "}";
  const nuevaLinea = "\n";

  let sentencias = [];
  let nivelAgrupacion = 0;
  let estaAgrupando = false;
  let sentenciaActual = "";
  let bloqueAgrupado = "";

  code.split("").forEach((caracter) => {
    if (caracter === abrirAgrupacion) {
      nivelAgrupacion++;
      estaAgrupando = true;
      return;
    }

    if (caracter === cerrarAgrupacion) {
      nivelAgrupacion--;

      if (nivelAgrupacion === 0) {
        estaAgrupando = false;

        sentenciaActual +=
          (sentenciaActual.endsWith("?") ? "" : "?") +
          bloqueAgrupado
            .split(";")
            .map((expresion) =>
              expresion
                .split("\n")
                .map((linea) => linea.trim())
                .filter(Boolean)
                .join(" ")
            )
            .map((expresion) => expresion.trim())
            .filter(Boolean)
            .map(
              (expresion) => expresion + (expresion.endsWith(";") ? "" : ";")
            )
            .join("");

        sentencias.push(sentenciaActual);
        bloqueAgrupado = "";
        sentenciaActual = "";
      }
      return;
    }

    if (estaAgrupando) {
      bloqueAgrupado += caracter;
    } else {
      if (caracter === nuevaLinea) {
        sentencias.push(sentenciaActual.trim());
        sentenciaActual = "";
        return;
      }
      sentenciaActual += caracter;
    }
  });

  sentencias = sentencias
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => linea + (linea.endsWith(";") ? "" : ";"));

  code = sentencias;
  return code;
}
