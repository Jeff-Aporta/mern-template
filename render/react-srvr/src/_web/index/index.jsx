import React from "react";

import "../../app/scss/main.scss";

import Footer from "../../app/theme/components/footer/footer.jsx";
import Seccion1 from "./index.Seccion1.jsx";
import Seccion2 from "./index.Seccion2.jsx";

export default Content;

function Content() {
  return (
    <div>
      <Seccion1 />
      <Seccion2 />
      <Footer />
    </div>
  );
}
