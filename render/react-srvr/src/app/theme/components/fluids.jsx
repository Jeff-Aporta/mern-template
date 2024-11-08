import fluidCSS from "fluid-css-lng";

const fsmin = 15;
const h1min = 30;
const h1max = 60;

const variants = {
  wmax: 1000,
  wmin: 320,
  normal: {
    min: 13,
    max: 15,
  },
  h1: {
    ...pvariant(60),
  },
  h2: {
    ...pvariant(55),
  },
  h3: {
    ...pvariant(50),
  },
  h4: {
    ...pvariant(45),
  },
  h5: {
    ...pvariant(40),
  },
  h6: {
    ...pvariant(35),
  },
  h7: {
    ...pvariant(30),
  },
  h8: {
    ...pvariant(25),
  },
  h9: {
    ...pvariant(20),
  },
};

export { $h, $$h, $h1, $h2, $h3, $h4, $h5, $h6, $h7, $h8, $h9, $ };

function $$h() {
  return <div style={{ height: "30px" }} />;
}
function $h() {
  return <div style={{ height: "10px" }} />;
}

function pvariant(max) {
  return {
    max: max,
    min: Math.max(h1min * (max / h1max), fsmin),
  };
}

function $h1(props) {
  return <$ {...props} variant="h1" />;
}

function $h2(props) {
  return <$ {...props} variant="h2" />;
}

function $h3(props) {
  return <$ {...props} variant="h3" />;
}

function $h4(props) {
  return <$ {...props} variant="h4" />;
}

function $h5(props) {
  return <$ {...props} variant="h5" />;
}

function $h6(props) {
  return <$ {...props} variant="h6" />;
}

function $h7(props) {
  return <$ {...props} variant="h7" />;
}

function $h8(props) {
  return <$ {...props} variant="h8" />;
}

function $h9(props) {
  return <$ {...props} variant="h9" />;
}

function $(props) {
  const variant = variants[props.variant];
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX([variants.wmin, variants.wmax], {
          fontSize: [variant.min, variant.max],
        })
        .end(props.className)}
    />
  );
}
