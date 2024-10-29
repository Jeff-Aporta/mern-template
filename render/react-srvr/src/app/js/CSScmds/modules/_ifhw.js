import appvar from "./_vars";
import { buscarClase, regexGeneric, Npx } from "./_tools";

const [INDEX_SIMPLE, INDEX_TRUE, INDEX_FALSE] = [-1, 0, 1];
const [INDEX_DOWN, INDEX_IN, INDEX_UP] = [0, 1, 2];
const [DIR_W, DIR_H] = ["x", "y"];
const propMedia = {
  [DIR_W]: "width",
  [DIR_H]: "height",
};

let less_than_medias = {};
let up_than_medias = {};
let between_medias = {};

export default CrearIFHW;

function CrearIFHW() {
  appvar.reglasCMD["IFHW"] = (() => {
    return {
      accionar: generarStringCSS,
      cmd: ifw,
      reset: () => {
        less_than_medias = {};
        up_than_medias = {};
        between_medias = {};
      },
    };

    function ifw({
      comando,
      dir,
      propiedad_valor,
      operador,
      sz,
      min,
      max,
    } = {}) {
      if (!propiedad_valor) {
        if (comando) {
          return ejecutarComando();
        }
        return;
      }

      let clase = Math.random().toString(36).replace("0.", `ifw-${operador}-`);

      clase = (() => {
        const c_less = buscarClase(less_than_medias[dir]?.[sz], comando);
        if (c_less) {
          return c_less;
        }
        const c_up = buscarClase(up_than_medias[dir]?.[sz], comando);
        if (c_up) {
          return c_up;
        }
        const c_bet = buscarClase(between_medias[dir]?.[min]?.[max], comando);
        if (c_bet) {
          return c_bet;
        }

        switch (operador) {
          case "less":
          case "up":
            upOrLess_than({
              array: operador === "up" ? up_than_medias : less_than_medias,
              dir,
              propiedad_valor,
              sz,
              comando,
              clase,
            });
            break;
          case "between":
            between({ propiedad_valor, dir, min, max, comando, clase });
            break;
        }

        appvar.huboCambio = true;

        return clase;
      })();

      return clase;

      function ordenarComando({ props, dir, min, max, sz, type }) {
        props = props.split(";").filter(Boolean).sort();
        switch (type) {
          case "less":
            return `${dir}<${sz}?${props.join(";")}`;
          case "up":
            return `${dir}>${sz}?${props.join(";")}`;
          case "between":
            return `${min}<${dir}<${max}?${props.join(";")}`;
        }
      }

      function ejecutarComando() {
        if (comando) {
          return ejecutarBetween() ?? ejecutarLess() ?? ejecutarUp();

          function ejecutarUp() {
            return ejecutarUpOrLess(">");
          }

          function ejecutarLess() {
            return ejecutarUpOrLess("<");
          }

          function checkCase(structure) {
            return ["x", "y"].map((d) =>
              regexGeneric(structure(d)).test(comando)
            );
          }

          function ejecutarBetween() {
            const bet_op = /(<|>)/.source;
            const structure = (d) => `${Npx}${bet_op}${d}${bet_op}${Npx}`;
            const [regexW, regexH] = checkCase(structure);
            if (regexW || regexH) {
              const [cond, vals] = comando.split("?");
              let op = cond.includes("<") ? "<" : ">";
              const split = cond.split(op);
              const [min, , max] = op === "<" ? split : split.reverse();
              const dir = regexW ? DIR_W : DIR_H;

              return ifw({
                comando: ordenarComando({
                  props: vals,
                  dir,
                  min,
                  max,
                  type: "between",
                }),
                dir,
                propiedad_valor: extraerValores(vals),
                operador: "between",
                min,
                max,
              });
            }
          }

          function ejecutarUpOrLess(op) {
            const [regexW, regexH] = ["x", "y"].map((d) =>
              regexUpOrLess(op, d).test(comando)
            );
            if (regexW || regexH) {
              const type = op === "<" ? "less" : "up";
              const [cond, vals] = comando.split("?");
              let [, sz] = cond.split(op);

              if (!sz.endsWith("px")) {
                sz += "px";
              }

              const dir = regexW ? DIR_W : DIR_H;

              return ifw({
                comando: ordenarComando({ props: vals, dir, sz, type }),
                dir,
                propiedad_valor: extraerValores(vals),
                operador: type,
                sz,
              });
            }

            function regexUpOrLess(op, d) {
              return regexGeneric(`${d}${op}${Npx}`);
            }
          }
        }
      }

      function extraerValores(vals) {
        return vals
          .split(";")
          .filter(Boolean)
          .map((v) => {
            let [prop, val] = v.split(":");

            if (val.includes("(") || val.includes("[")) {
              const tieneDobleCierre = val.includes("[") && val.includes("(");

              val = combinatoriaDeEstados(
                calcularValoresDeEstado({ val, tieneDobleCierre })
              );
            }

            return {
              propiedad: prop,
              valor: val,
            };

            function calcularValoresDeEstado({ val, tieneDobleCierre }) {
              protegerComas();

              let maxStates = 0;

              const valoresDeEstados = val.map((v) => {
                return partirEstados(eliminarParentesisInnecesarios(v));
              });

              return {
                maxStates,
                valoresDeEstados,
              };

              function partirEstados(v) {
                v = v.split(",").map((sv) => sv.trim());
                maxStates = Math.max(maxStates, v.length);
                return v;
              }

              function eliminarParentesisInnecesarios(v) {
                if (tieneDobleCierre) {
                  v = v.replace(/[\[\]]/g, "");
                } else {
                  v = v.replace(/[()\[\]]/g, "");
                }
                return v;
              }

              function protegerComas() {
                let contadorParentesis = 0;
                if (tieneDobleCierre) {
                  val = val
                    .split("")
                    .map((p) => {
                      if (p === "(") {
                        contadorParentesis++;
                      }
                      if (p === ")") {
                        contadorParentesis--;
                      }
                      if (p === "," && contadorParentesis) {
                        return "&";
                      }
                      return p;
                    })
                    .join("");
                }
                if (tieneDobleCierre) {
                  val = val.split("[");
                } else {
                  val = val.split(/[(\[]/g);
                }
              }
            }

            function combinatoriaDeEstados({ maxStates, valoresDeEstados }) {
              const val = valoresDeEstados;
              let estados = [];
              for (let i = 0; i < maxStates; i++) {
                let estadoActual = [];
                for (let j = 0; j < val.length; j++) {
                  switch (val[j].length) {
                    case 1:
                      estadoActual.push(val[j][0]);
                      break;
                    case 2:
                      if (maxStates === 3) {
                        switch (i) {
                          case INDEX_DOWN:
                            estadoActual.push(val[j][INDEX_FALSE]);
                            break;
                          case INDEX_IN:
                            estadoActual.push(val[j][INDEX_TRUE]);
                            break;
                          case INDEX_UP:
                            estadoActual.push(val[j][INDEX_FALSE]);
                            break;
                        }
                      } else {
                        estadoActual.push(val[j][i]);
                      }
                      break;
                    case 3:
                      estadoActual.push(val[j][i]);
                      break;
                  }
                }
                estados.push(
                  estadoActual
                    .map((v) => v.trim().replaceAll("&", ","))
                    .filter(Boolean)
                    .join(" ")
                );
              }
              return estados;
            }
          });
      }

      function upOrLess_than({
        array,
        propiedad_valor,
        dir,
        sz,
        comando,
        clase,
      }) {
        array[dir] ??= {};
        array[dir][sz] ??= {};
        if (array[dir][sz][comando]) {
          return;
        }
        array[dir][sz][comando] = {
          [clase]: getValsBifurcate({ propiedad_valor }),
        };
      }

      function between({ propiedad_valor, dir, min, max, comando, clase }) {
        between_medias[dir] ??= {};
        between_medias[dir][min] ??= {};
        between_medias[dir][min][max] ??= [];
        if (between_medias[dir][min][max][comando]) {
          return;
        }
        between_medias[dir][min][max][comando] = {
          [clase]: getValsBifurcate({ propiedad_valor }),
        };
      }

      function getValsBifurcate({ propiedad_valor }) {
        const caminos = Object.values(propiedad_valor).reduce((max, v) => {
          if (Array.isArray(v.valor)) {
            const l = v.valor.length;
            return l > max ? l : max;
          }
          return max;
        }, 0);

        let cuerpo = VAL(caminos);

        cuerpo = cuerpo.map((v, index) => {
          const cc = v.join("\n\t\t").trim();
          if (cc) {
            return `\t/*${comando}*/\n\t.${clase}{\n\t\t${cc}\n\t}`;
          }
          return "";
        });

        return cuerpo;

        function VAL(posibiliades = 1) {
          const retorno = Array.from({ length: posibiliades }).map(() => []);

          Object.values(propiedad_valor).forEach((pv) => {
            if (!pv.valor) {
              return;
            }
            if (Array.isArray(pv.valor)) {
              pv.valor.forEach((v, i) => {
                if (!v) {
                  return;
                }
                retorno[i].push(toString(pv.propiedad, v));
              });
            } else {
              for (const i in retorno) {
                retorno[i].push(toString(pv.propiedad, pv.valor));
              }
            }
          });

          return retorno;
        }

        function toString(prop, val) {
          if (!val) {
            return false;
          }
          return `${prop}: ${val} !important;`;
        }
      }
    }

    function generarStringCSS() {
      const html = [];

      generarReglas(less_than_medias, (_, dir, key) => {
        aplicarReglaMedia({
          media: `${propMedia[dir]} < ${key}`,
          index: () => INDEX_TRUE,
          array: _,
          key,
          dir,
        });
        aplicarReglaMedia({
          media: `${propMedia[dir]} >= ${key}`,
          index: () => INDEX_FALSE,
          array: _,
          key,
          dir,
        });
      });

      generarReglas(up_than_medias, (_, dir, key) => {
        aplicarReglaMedia({
          media: `${propMedia[dir]} > ${key}`,
          index: () => INDEX_TRUE,
          array: _,
          key,
          dir,
        });
        aplicarReglaMedia({
          media: `${propMedia[dir]} <= ${key}`,
          index: () => INDEX_FALSE,
          array: _,
          key,
          dir,
        });
      });

      generarReglas(between_medias, (array, dir, key) => {
        const [min, max] = key;
        aplicarReglaMedia({
          media: `${min} <= ${propMedia[dir]} <= ${max}`,
          index: (l) => {
            switch (l) {
              case 2:
                return INDEX_TRUE;
              case 3:
                return INDEX_IN;
            }
          },
          array,
          key,
          dir,
        });
        aplicarReglaMedia({
          media: `${propMedia[dir]} < ${min}`,
          index: (l) => {
            switch (l) {
              case 2:
                return INDEX_FALSE;
              case 3:
                return INDEX_DOWN;
            }
          },
          array,
          key,
          dir,
        });
        aplicarReglaMedia({
          media: `${propMedia[dir]} > ${max}`,
          index: (l) => {
            switch (l) {
              case 2:
                return INDEX_FALSE;
              case 3:
                return INDEX_UP;
            }
          },
          array,
          key,
          dir,
        });
      });

      function generarReglas(array, reglas) {
        if (array === between_medias) {
          Object.keys(array).forEach((dir) => {
            Object.keys(array[dir]).forEach((min) => {
              Object.keys(array[dir][min]).forEach((max) => {
                reglas(array, dir, [min, max]);
              });
            });
          });
          return;
        }
        Object.keys(array).forEach((dir) => {
          Object.keys(array[dir]).forEach((key) => {
            reglas(array, dir, key);
          });
        });
      }

      function aplicarReglaMedia({ media, index, array, key, dir }) {
        index = [() => INDEX_SIMPLE, index];
        const e = [];
        index.forEach((i) => {
          extractIndex(i, array[dir], key, e);
        });
        if (e.length) {
          html.push(`@media (${media}) {`);
          html.push(e.join("\n\n"));
          html.push(`}`);
        }
      }

      function extractIndex(index, array, key, retorno = []) {
        const obj = Array.isArray(key) ? array[key[0]][key[1]] : array[key];
        Object.values(obj)
          .map((cls) => {
            const clsStruc = Object.values(cls)[0];
            if (Array.isArray(clsStruc)) {
              const l = clsStruc.length;
              return clsStruc[index(l)];
            }
            return clsStruc;
          })
          .filter(Boolean)
          .forEach((v) => {
            retorno.push(v);
          });
        return retorno;
      }

      return html.join("\n");
    }
  })();
}
