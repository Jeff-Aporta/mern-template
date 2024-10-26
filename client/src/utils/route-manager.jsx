import { createBrowserRouter, useParams } from "react-router-dom";
import componentsMap from "./mapfiles-jsx";

function RouteComponent() {
  const params = useParams();
  const nodes = Array.from({ length: 10 })
    .map((_, n) => params[`node${n + 1}`])
    .filter(Boolean);
  let K = nodes.join("/");
  if (!componentsMap[K]) {
    const index = [K, "index"].filter(Boolean).join("/");
    const homonim = [K, nodes.at(-1)].join("/");
    if (componentsMap[index]) {
      K = index;
    }
    if (componentsMap[homonim]) {
      K = homonim;
    }
  }
  return componentsMap[K];
}

let pattern = "";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteComponent />,
  },
  ...Array.from({ length: 10 }).map((_, i) => {
    pattern += `/:node${i + 1}`;
    return {
      path: pattern,
      element: <RouteComponent />,
    };
  }),
]);

export default router;
