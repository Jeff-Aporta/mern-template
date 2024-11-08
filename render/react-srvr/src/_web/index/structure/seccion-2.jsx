import React from "react";

import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

import fluidCSS from "fluid-css-lng";
import content from "./content";

import { $h1, $h2, $h4 } from "../../../app/theme/components/fluids";

export default Seccion2;

const wbrk = 870;
const [hmin, hmax] = [200, 300];

function Seccion2() {
  return (
    <Paper elevation={1} className="content-container padh-30px">
      <$h4 className="c-deepskyblue">
        Tecnología a la medida para cada desafío
      </$h4>
      <p>
        En Cattleya Software somos especialistas en desarrollar soluciones
        tecnológicas personalizadas que responden a las necesidades únicas de tu
        empresa.
      </p>
      <p>
        Nuestra Suite miia ha sido diseñada para integrar y simplificar cada
        aspecto de la gestión empresarial, proporcionando herramientas avanzadas
        que potencian la productividad y eficiencia. Con nuestras soluciones, tu
        negocio puede alcanzar su máximo potencial.
      </p>
      <p>¡Hablemos sobre cómo podemos ayudarte a transformar tu negocio!</p>
    </Paper>
  );
}
