import appvar from "./_vars";
import { buscarClase, regexGeneric, Npx } from "./_tools";

const vs = {
  x: "vw",
  y: "vh",
};

let lerphws = {};
let appvarRoot = [];

export default CrearLERPHW;

function reset() {
  lerphws = {};
}

function CrearLERPHW() {
  appvar.reglasCMD["LERPHW"] = (() => {
    return {
      accionar: generarStringCSS,
      cmd: lerphw,
      reset,
    };

    function lerphw({ comando, propiedades_valores, min, dir, max }) {
      if (!propiedades_valores) {
        if (comando) {
          return ejecutarComando();
        }
        return;
      }

      let clase = Math.random().toString(36).replace("0.", `lerphw-${dir}-`);

      clase = (() => {
        const c_lerp = buscarClase(lerphws[dir]?.[min]?.[max], comando);
        if (c_lerp) {
          return c_lerp;
        }
        calcularLerp();
        appvar.huboCambio = true;
        return clase;
      })();

      return clase;

      function calcularLerp() {
        lerphws[dir] ??= {};
        lerphws[dir][min] ??= {};
        lerphws[dir][min][max] ??= {};
        if (lerphws[dir][min][max][comando]) {
          return;
        }
        const sze = lerphws[dir][min][max];

        const props = Object.values(propiedades_valores)
          .map((value) => {
            const appvarQ = [];
            const str = value.valor
              .map((v) => {
                if (typeof v === "string") {
                  return v;
                }
                function existeEnVarRoot(Tname, Tval) {
                  return appvarRoot.some(
                    (v) => v.varname === Tname && v.varval === Tval
                  );
                }
                if (!existeEnVarRoot(v.tname, v.t)) {
                  appvarRoot.push({
                    varname: v.tname,
                    varval: v.t,
                    str: v.t,
                  });
                }
                if (!existeEnVarRoot(v.varname, v.varval)) {
                  appvarRoot.push(v);
                }

                const varname = (() => {
                  const findeq = appvarRoot.find((vt) => vt.varval === v.str);
                  if (findeq) {
                    return findeq.varname;
                  }
                  const s = `--lerphw-v`;
                  const i = appvarRoot.length;
                  return `${s}${i}`;
                })();
                const repetido = appvarRoot.find((e) => e.varname === varname);
                const str = `var(${varname})`;
                if (!repetido) {
                  const ne = {
                    varname,
                    varval: v.str,
                    str,
                  };
                  appvarRoot.push(ne);
                }

                return str;
              })
              .join(" ");

            if (typeof value.valor === "string") {
              return `${value.propiedad}: ${value.valor} !important;`;
            }
            return [
              ...appvarQ.map((v) => `${v.varname}: ${v.varval};`),
              `${value.propiedad}: ${str} !important;`,
            ].join("\n\t");
          })
          .join("\n\t");
        sze[comando] = {
          [clase]: `/*${comando}*/\n.${clase}{\n\t${props}\n}`,
        };
      }

      function makeLerp({ min, dir, max, value }) {
        const i = min;
        const ni = parseInt(i).toFixed(1);
        const nf = parseInt(max).toFixed(1);

        const vis = value.i;
        const vi = Number(parseInt(vis).toFixed(1));
        const vf = parseInt(value.f).toFixed(1);

        const v = ni === 0 ? `100${vs[dir]}` : `(100${vs[dir]} - ${i})`;
        const d = (() => {
          if (nf - ni === 1) {
            return "";
          }
          return ` / ${nf - ni}`;
        })();
        const t = (() => {
          if (nf === ni) {
            return 0;
          }
          if (ni === 0 && nf - ni === 1) {
            return v;
          }
          return `calc(${v}${d})`;
        })();
        const valor = (() => {
          const tdef = "--lerphw-t";
          if (value.iopen && value.fopen) {
            return _lerp_();
          }
          if (value.iclose && value.fclose) {
            const t_ends = `clamp(0px, var(${tdef}), 1px)`;
            return _lerp_(t_ends, `--lerphw-te`);
          }
          if (value.iopen && value.fclose) {
            const t_open_end = `clamp(-1px, var(${tdef}), 1px)`;
            return _lerp_(t_open_end, `--lerphw-toe`);
          }
          if (value.iclose && value.fopen) {
            const t_end_open = `max(0px, var(${tdef}))`;
            return _lerp_(t_end_open, `--lerphw-teo`);
          }
          return _lerp_();

          function _lerp_(_t_ = t, name = tdef) {
            const minr = parseInt(min).toString(36);
            const maxr = parseInt(max).toString(36);
            name = `${name}-${dir}-${minr}-${maxr}`;
            const s = vi === 0 ? "" : ` + ${vi}px`;
            const m = vf - vi === 1 ? "" : `${vf - vi} * `;
            if (s === 0 && m === 1) {
              return {
                t,
                varval: "-1",
                varname: name,
                str: `var(${name})`,
                tname: `${tdef}-${dir}-${minr}-${maxr}`,
              };
            }
            const tname = `${tdef}-${dir}-${minr}-${maxr}`;
            return {
              t,
              tname,
              varname: name,
              str: `calc(${m}var(${name})${s})`,
              varval: _t_.replaceAll(`var(${tdef})`, `var(${tname})`),
            };
          }
        })();

        return valor;
      }

      function ejecutarComando() {
        const [regexW, regexH] = ["x", "y"].map((d) =>
          regexGeneric(`${Npx}<-${d}->${Npx}`).test(comando)
        );

        function ordenarComando({ min, dir, max, props }) {
          props = props.split(";").filter(Boolean).sort();
          return `${min}<-${dir}->${max}?${props.join(";")}`;
        }

        if (regexW || regexH) {
          const [cond, props] = comando.split("?");
          const dir = regexW ? "x" : "y";
          const [min, max] = cond.split(`<-${dir}->`).map((v) => forzarPX(v));
          comando = ordenarComando({ min, dir, max, props });
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
                  dir,
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
                .map((v) => (typeof v === "string" ? v.trim() : v))
                .filter(Boolean);

              return {
                propiedad: prop,
                valor: params,
              };
            });

          return lerphw({ comando, propiedades_valores, min, dir, max });

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
      appvarRoot.forEach((v) => {
        html.push(`\t${v.varname}: ${v.varval};`);
      });
      html.push("}");
      Object.keys(lerphws).forEach((dir) => {
        Object.keys(lerphws[dir]).forEach((min) => {
          Object.keys(lerphws[dir][min]).forEach((max) => {
            Object.values(lerphws[dir][min][max]).forEach((cls) => {
              html.push(Object.values(cls)[0]);
            });
          });
        });
      });
      return html.join("\n");
    }
  })();
}
