let actualizarStyleState = true;
const reglasCMD = {};

let css_cmdscalc = `
  .css-cmdscalc {display: none !important;&.protected{display: block !important;}}
`;

let huboCambio = false;

setTimeout(() => {
  css_cmdscalc = "/*.css-cmdcalc remove*/";
  actualizarStyle();
}, 1);

const style = document.createElement("style");
style.classList.add("diseño-adaptativo");
style.innerHTML = css_cmdscalc;

(document.head || document.getElementsByTagName("head")[0]).appendChild(style);

function actualizarStyle() {
  actualizarStyleState = true;
  const html = Object.entries(reglasCMD)
    .map(([k, regla]) => [`/* REGLAS ${k} */`, regla.accionar()].join("\n"))
    .join("\n");
  style.innerHTML = [css_cmdscalc, html].join("\n\n");

  setTimeout(() => {
    document.querySelectorAll(".css-cmdscalc").forEach((e) => {
      e.classList.remove("css-cmdscalc");
      e.classList.remove("protected");
    });
  }, 0);
}

const CSScmdsReset = () => {
  Object.values(reglasCMD).forEach((regla) => {
    regla.reset();
  });
  actualizarStyle();
};

const CSScmds = ({ code, clss = [] } = {}) => {
  if (typeof clss == "string") {
    clss = [clss];
  }
  clss = clss.join(" ").trim();
  if (typeof code != "string") {
    return clss;
  }

  function soportarMultilinea() {
    const opagr = "{";
    const clarg = "}";
    const clargu = "\n";
    let sentencias = [];
    let constadorAgr = 0;
    let estaAgrupando = false;
    let sentencia = "";
    let agrupacion = "";
    code.split("").forEach((c, i) => {
      if (c == opagr) {
        constadorAgr++;
        estaAgrupando = true;
        return;
      }
      if (c == clarg) {
        constadorAgr--;
        if (constadorAgr == 0) {
          estaAgrupando = false;
          sentencia +=
            (sentencia.endsWith("?") ? "" : "?") +
            agrupacion
              .split(";")
              .map((e) =>
                e
                  .split("\n")
                  .map((e2) => e2.trim())
                  .filter(Boolean)
                  .join(" ")
              )
              .map((e) => e.trim())
              .filter(Boolean)
              .map((e) => e + (e.endsWith(";") ? "" : ";"))
              .join("");
          sentencias.push(sentencia);
          agrupacion = "";
          sentencia = "";
        }
        return;
      }
      if (estaAgrupando) {
        agrupacion += c;
      } else {
        if (c == clargu) {
          sentencias.push(sentencia);
          sentencia = "";
          return;
        }
        sentencia += c;
      }
      if (constadorAgr == 0 && estaAgrupando) {
        estaAgrupando = false;
        sentencias.push(sentencia);
        sentencia = "";
      }
    });

    sentencias = sentencias
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => v + (v.endsWith(";") ? "" : ";"));

    code = sentencias;
  }

  soportarMultilinea();

  if (!code.length) {
    return clss;
  }

  update();

  let retorno = code
    .map((cmd) =>
      Object.values(reglasCMD).reduce((acc, regla) => {
        if (!acc) {
          const t = regla.cmd({ comando: cmd });
          if (t) {
            return t;
          }
        }
        return acc;
      }, "")
    )
    .join(" ");

  let r = [retorno, clss, "css-cmdscalc"].filter(Boolean).join(" ").trim();
  while (r.includes("  ")) {
    r = r.replaceAll("  ", " ");
  }
  return r;

  function update() {
    if (actualizarStyleState && huboCambio) {
      huboCambio = false;
      actualizarStyleState = false;
      actualizarStyle();
    }
  }
};

CrearIFW();
CrearLERPW();

const Npx = /(\d+\.?\d*)(px)?/.source;

function regexGeneric(ruleXCond) {
  const prop = /([a-z-]+)/.source;
  const txt = /[\w\s-]+/.source;
  const val = (() => {
    const valSimple = `(${txt})?`;
    const valMultiple = (() => {
      const params = `(${txt},?){1,3}`;
      const op = /[(\[]/.source;
      const cl = /[)\]]/.source;
      return `(${op}${params}${cl})?`;
    })();
    return `${valSimple}${valMultiple}`;
  })();
  const vals = `(${prop}:${val};?)+`;
  return new RegExp(`${ruleXCond}\\?${vals}`, "ig");
}

/*
    x<600px?color:(red,green);border:(1px solid white,1px solid gold);background:blue;
    x>600px?color:(red,green);border:(1px solid white,1px solid gold)background:blue;
    400px<x<600px?color:(red,green);border:(1px solid white,1px solid gold)background:blue;
  */
function CrearIFW() {
  reglasCMD["IFW"] = (() => {
    const [INDEX_SIMPLE, INDEX_TRUE, INDEX_FALSE] = [-1, 0, 1];
    const [INDEX_DOWN, INDEX_IN, INDEX_UP] = [0, 1, 2];

    let less_than_medias = {};
    let up_than_medias = {};
    let between_medias = {};

    function reset() {
      less_than_medias = {};
      up_than_medias = {};
      between_medias = {};
    }

    function ifw({ comando, propiedad_valor, operador, sz, min, max } = {}) {
      if (!propiedad_valor) {
        if (comando) {
          return ejecutarComando();
        }
        return;
      }

      let clase = Math.random().toString(36).replace("0.", `ifw-${operador}-`);

      clase = (() => {
        const c_less = buscarClase(less_than_medias[sz], comando);
        if (c_less) {
          return c_less;
        }
        const c_up = buscarClase(up_than_medias[sz], comando);
        if (c_up) {
          return c_up;
        }
        const c_bet = buscarClase(between_medias[min]?.[max], comando);
        if (c_bet) {
          return c_bet;
        }

        switch (operador) {
          case "less":
          case "up":
            upOrLess_than({
              array: operador == "up" ? up_than_medias : less_than_medias,
              propiedad_valor,
              sz,
              comando,
              clase,
            });
            break;
          case "between":
            between({ propiedad_valor, min, max, comando, clase });
            break;
        }

        huboCambio = true;

        return clase;
      })();

      return clase;

      function ordenarComando(props, min, max, sz, type) {
        props = props.split(";").filter(Boolean).sort();
        switch (type) {
          case "less":
            return `x<${sz}?${props.join(";")}`;
          case "up":
            return `x>${sz}?${props.join(";")}`;
          case "between":
            return `${min}<x<${max}?${props.join(";")}`;
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

          function ejecutarBetween() {
            const bet_op = /(<|>)/.source;
            if (regexGeneric(`${Npx}${bet_op}x${bet_op}${Npx}`).test(comando)) {
              const [cond, vals] = comando.split("?");
              let op = cond.includes("<") ? "<" : ">";
              const split = cond.split(op);
              const [min, , max] = op == "<" ? split : split.reverse();

              return ifw({
                comando: ordenarComando(vals, min, max, null, "between"),
                propiedad_valor: extraerValores(vals),
                operador: "between",
                min,
                max,
              });
            }
          }

          function ejecutarUpOrLess(op) {
            if (regexUpOrLess(op).test(comando)) {
              const type = op == "<" ? "less" : "up";
              const [cond, vals] = comando.split("?");
              const [, sz] = cond.split(op);

              if (!sz.endsWith("px")) {
                sz += "px";
              }

              return ifw({
                comando: ordenarComando(vals, null, null, sz, type),
                propiedad_valor: extraerValores(vals),
                operador: type,
                sz,
              });
            }

            function regexUpOrLess(op) {
              return regexGeneric(`x${op}${Npx}`);
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
                      if (p == "(") {
                        contadorParentesis++;
                      }
                      if (p == ")") {
                        contadorParentesis--;
                      }
                      if (p == "," && contadorParentesis) {
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
                      if (maxStates == 3) {
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

      function upOrLess_than({ array, propiedad_valor, sz, comando, clase }) {
        array[sz] ??= {};
        if (array[sz][comando]) {
          return;
        }
        array[sz][comando] = {
          [clase]: getValsBifurcate({ propiedad_valor }),
        };
      }

      function between({ propiedad_valor, min, max, comando, clase }) {
        between_medias[min] ??= {};
        between_medias[min][max] ??= [];
        if (between_medias[min][max][comando]) {
          return;
        }
        between_medias[min][max][comando] = {
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

      generarReglas(less_than_medias, (_, key) => {
        aplicarReglaMedia({
          media: `width < ${key}`,
          index: () => INDEX_TRUE,
          array: _,
          key,
        });
        aplicarReglaMedia({
          media: `width >= ${key}`,
          index: () => INDEX_FALSE,
          array: _,
          key,
        });
      });

      generarReglas(up_than_medias, (_, key) => {
        aplicarReglaMedia({
          media: `width > ${key}`,
          index: () => INDEX_TRUE,
          array: _,
          key,
        });
        aplicarReglaMedia({
          media: `width <= ${key}`,
          index: () => INDEX_FALSE,
          array: _,
          key,
        });
      });

      generarReglas(between_medias, (array, key) => {
        const [min, max] = key;
        aplicarReglaMedia({
          media: `${min} <= width <= ${max}`,
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
        });
        aplicarReglaMedia({
          media: `width < ${min}`,
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
        });
        aplicarReglaMedia({
          media: `width > ${max}`,
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
        });
      });

      function generarReglas(array, reglas) {
        if (array == between_medias) {
          Object.keys(array).forEach((min) => {
            Object.keys(array[min]).forEach((max) => {
              reglas(array, [min, max]);
            });
          });
          return;
        }
        Object.keys(array).forEach((key) => {
          reglas(array, key);
        });
      }

      function aplicarReglaMedia({ media, index, array, key }) {
        index = [() => INDEX_SIMPLE, index];
        const e = [];
        index.forEach((i) => {
          extractIndex(i, array, key, e);
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

    return {
      accionar: generarStringCSS,
      cmd: ifw,
      reset,
    };
  })();
}

function buscarClase(obj, comando) {
  if (!obj || !comando) {
    return;
  }
  const comandoGuardado = Object.keys(obj).find((key) => key == comando);
  if (comandoGuardado) {
    return Object.keys(obj[comandoGuardado])[0];
  }
}

function CrearLERPW() {
  reglasCMD.LERPW = (() => {
    let lerpws = {};
    let varsRoot = [];

    function reset() {
      lerpws = {};
    }

    function lerpw({ comando, propiedades_valores, min, max }) {
      if (!propiedades_valores) {
        if (comando) {
          return ejecutarComando();
        }
        return;
      }

      let clase = Math.random().toString(36).replace("0.", `lerpw-`);

      clase = (() => {
        const c_lerp = buscarClase(lerpws[min]?.[max], comando);
        if (c_lerp) {
          return c_lerp;
        }

        calcularLerp();

        huboCambio = true;

        return clase;
      })();

      return clase;

      function calcularLerp() {
        lerpws[min] ??= {};
        lerpws[min][max] ??= {};
        if (lerpws[min][max][comando]) {
          return;
        }
        const sze = lerpws[min][max];

        const props = Object.values(propiedades_valores)
          .map((value) => {
            const varsQ = [];
            const str = value.valor
              .map((v) => {
                if (typeof v == "string") {
                  return v;
                }
                function existeEnVarRoot(Tname, Tval) {
                  return varsRoot.some(
                    (v) => v.varname == Tname && v.varval == Tval
                  );
                }
                if (!existeEnVarRoot(v.tname, v.t)) {
                  varsRoot.push({
                    varname: v.tname,
                    varval: v.t,
                    str: v.t,
                  });
                }
                if (!existeEnVarRoot(v.varname, v.varval)) {
                  varsRoot.push(v);
                }

                const varname = (() => {
                  const findeq = varsRoot.find((vt) => vt.varval == v.str);
                  if (findeq) {
                    return findeq.varname;
                  }
                  const s = `--lerpw-v`;
                  const i = varsRoot.length;
                  return `${s}${i}`;
                })();
                const repetido = varsRoot.find((e) => e.varname == varname);
                const str = `var(${varname})`;
                if (!repetido) {
                  const ne = {
                    varname,
                    varval: v.str,
                    str,
                  };
                  varsRoot.push(ne);
                }

                return str;
              })
              .join(" ");

            if (typeof value.valor == "string") {
              return `${value.propiedad}: ${value.valor} !important;`;
            }
            return [
              ...varsQ.map((v) => `${v.varname}: ${v.varval};`),
              `${value.propiedad}: ${str} !important;`,
            ].join("\n\t");
          })
          .join("\n\t");
        sze[comando] = {
          [clase]: `/*${comando}*/\n.${clase}{\n\t${props}\n}`,
        };
      }

      function makeLerp({ min, max, value }) {
        const i = min;
        const ni = parseInt(i).toFixed(1);
        const nf = parseInt(max).toFixed(1);

        const vis = value.i;
        const vi = Number(parseInt(vis).toFixed(1));
        const vf = parseInt(value.f).toFixed(1);

        const v = ni == 0 ? "100vw" : `(100vw - ${i})`;
        const d = (() => {
          if (nf - ni == 1) {
            return "";
          }
          return ` / ${nf - ni}`;
        })();
        const t = (() => {
          if (nf == ni) {
            return 0;
          }
          if (ni == 0 && nf - ni == 1) {
            return v;
          }
          return `calc(${v}${d})`;
        })();
        const valor = (() => {
          const tdef = "--lerpw-t";
          if (value.iopen && value.fopen) {
            return _lerp_();
          }
          if (value.iclose && value.fclose) {
            const t_ends = `clamp(0px, var(${tdef}), 1px)`;
            return _lerp_(t_ends, `--lerpw-te`);
          }
          if (value.iopen && value.fclose) {
            const t_open_end = `clamp(-1px, var(${tdef}), 1px)`;
            return _lerp_(t_open_end, `--lerpw-toe`);
          }
          if (value.iclose && value.fopen) {
            const t_end_open = `max(0px, var(${tdef}))`;
            return _lerp_(t_end_open, `--lerpw-teo`);
          }
          return _lerp_();

          function _lerp_(_t_ = t, name = tdef) {
            const minr = parseInt(min).toString(36);
            const maxr = parseInt(max).toString(36);
            name = `${name}-${minr}-${maxr}`;
            const s = vi == 0 ? "" : ` + ${vi}px`;
            const m = vf - vi == 1 ? "" : `${vf - vi} * `;
            if (s == 0 && m == 1) {
              return {
                varname: name,
                varval: "-1",
                t,
                tname: `${tdef}-${minr}-${maxr}`,
                str: `var(${name})`,
              };
            }
            const tname = `${tdef}-${minr}-${maxr}`;
            return {
              varname: name,
              varval: _t_.replaceAll(`var(${tdef})`, `var(${tname})`),
              t,
              tname,
              str: `calc(${m}var(${name})${s})`,
            };
          }
        })();

        return valor;
      }

      function ejecutarComando() {
        const regex = regexGeneric(`${Npx}<-x->${Npx}`);

        function ordenarComando(min, max, props) {
          props = props.split(";").filter(Boolean).sort();
          return `${min}<-x->${max}?${props.join(";")}`;
        }

        if (regex.test(comando)) {
          const [cond, props] = comando.split("?");
          const [min, max] = cond.split("<-x->").map((v) => forzarPX(v));
          comando = ordenarComando(min, max, props);
          propiedades_valores = props
            .split(";")
            .filter(Boolean)
            .map((v) => {
              let [prop, val] = v.split(":");

              val = val.replaceAll("[", "[C").replaceAll("]", "C]");
              val = val.replaceAll("(", "(O").replaceAll(")", "O)");

              let params = val.split(/[()\[\]]/g);

              params = params.map((v) => {
                if (!v.includes(",")) {
                  return v;
                }
                let [i, f] = v.split(",");

                const iopen = i.startsWith("O");
                const iclose = i.startsWith("C");
                const fopen = f.endsWith("O");
                const fclose = f.endsWith("C");

                i = forzarPX(i.replace(/[OC]/g, ""));
                f = forzarPX(f.replace(/[OC]/g, ""));

                const valor = makeLerp({
                  min,
                  max,
                  value: {
                    i,
                    iopen,
                    iclose,
                    f,
                    fopen,
                    fclose,
                  },
                });

                return valor;
              });

              params = params
                .map((v) => (typeof v == "string" ? v.trim() : v))
                .filter(Boolean);

              return {
                propiedad: prop,
                valor: params,
              };
            });

          return lerpw({ comando, propiedades_valores, min, max });

          function forzarPX(str) {
            str = str.trim();
            if (!str.endsWith("px")) {
              return str + "px";
            }
            return str;
          }
        }
      }
    }

    function generarStringCSS() {
      const html = [];
      html.push(":root {");
      varsRoot.forEach((v) => {
        html.push(`\t${v.varname}: ${v.varval};`);
      });
      html.push("}");
      Object.keys(lerpws).forEach((min) => {
        Object.keys(lerpws[min]).forEach((max) => {
          Object.values(lerpws[min][max]).forEach((cls) => {
            html.push(Object.values(cls)[0]);
          });
        });
      });
      return html.join("\n");
    }

    return {
      accionar: generarStringCSS,
      cmd: lerpw,
      reset,
    };
  })();
}

export default CSScmds;
