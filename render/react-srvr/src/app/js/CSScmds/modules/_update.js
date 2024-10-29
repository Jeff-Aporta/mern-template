import appvar from "./_vars";

setTimeout(() => {
  appvar.css_cmdscalc = "/*.css-cmdcalc remove*/";
  actualizarStyle();
}, 1);

function actualizarStyle() {
  appvar.actualizarStyleState = true;

  const html = Object.entries(appvar.reglasCMD)
    .map(([k, regla]) => [`/* REGLAS ${k} */`, regla.accionar()].join("\n"))
    .join("\n");

  appvar.style.innerHTML = [appvar.css_cmdscalc, html].join("\n\n");

  setTimeout(() => {
    document.querySelectorAll(".css-cmdscalc").forEach((e) => {
      e.classList.remove("css-cmdscalc");
      e.classList.remove("protected");
    });
  }, 0);
}

export default actualizarStyle;
