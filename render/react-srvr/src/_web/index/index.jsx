import React from "react";

import _Seccion1 from "./_Seccion1.jsx";
import _Seccion2 from "./_Seccion2.jsx";

import { Default } from "../../app/theme/templates.jsx";

export default Index;

function Index() {
  return (
    <Default>
      <_Seccion1 />
      <_Seccion2 />
    </Default>
  );
}
