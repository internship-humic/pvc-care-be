import authRoutes from "./domains/auth/auth.routes.js";
import farmRoutes from "./domains/farm/farm.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/farm",
    route: farmRoutes,
  },
];

export default routes;
