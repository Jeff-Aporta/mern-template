import React from "react";

import Seccion1 from "./index.Seccion1.jsx";
import Seccion2 from "./index.Seccion2.jsx";

import { Default } from "../../app/theme/templates.jsx";

export default Index;

function Index() {
  return (
    <Default>
      <Seccion1 />
      <Seccion2 />
    </Default>
  );
}
