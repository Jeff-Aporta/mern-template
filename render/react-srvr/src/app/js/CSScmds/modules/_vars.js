const css_cmdscalc = `
    .css-cmdscalc {display: none !important;&.protected{display: block !important;}}
`;

const style = document.createElement("style");
style.classList.add("diseño-adaptativo");
style.innerHTML = css_cmdscalc;

(document.head || document.getElementsByTagName("head")[0]).appendChild(style);

const vars = {
  huboCambio: false,
  actualizarStyleState: true,
  reglasCMD: {},
  css_cmdscalc,
  style,
};

export default vars;
