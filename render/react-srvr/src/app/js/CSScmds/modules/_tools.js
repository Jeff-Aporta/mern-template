const Npx = /(\d+\.?\d*)(px)?/.source;

export { buscarClase, regexGeneric, Npx };

function buscarClase(obj, comando) {
  if (!obj || !comando) {
    return;
  }
  const comandoGuardado = Object.keys(obj).find((key) => key === comando);
  if (comandoGuardado) {
    return Object.keys(obj[comandoGuardado])[0];
  }
}

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
