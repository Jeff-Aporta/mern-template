import React from "react";

import Seccion_1 from "./structure/seccion-1.jsx";
import Seccion_2 from "./structure/seccion-2.jsx";

import { Default } from "../../app/theme/templates.jsx";
import { $h } from "../../app/theme/components/fluids.jsx";

export default Index;

function Index() {
  return (
    <Default>
      <Seccion_1 />
      <$h/>
      <Seccion_2 />
    </Default>
  );
}
