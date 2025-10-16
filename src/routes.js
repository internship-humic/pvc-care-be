import authRoutes from "./domains/auth/auth.routes.js";
import farmRoutes from "./domains/farm/farm.routes.js";
import farmProductRoutes from "./domains/farm-product/farm-product.routes.js";
import plantRoutes from "./domains/plant/plant.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/farm",
    route: farmRoutes,
  },
  {
    path: "/farm-product",
    route: farmProductRoutes,
  },
  {
    path: "/plant",
    route: plantRoutes,
  },
];

export default routes;
