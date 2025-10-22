import farmerAuthRoutes from "./domains/farmer-auth/farmer-auth.routes.js";
import customerAuthRoutes from "./domains/customer-auth/customer-auth.routes.js";
import profileRoutes from "./domains/profile/profile.routes.js";
import farmRoutes from "./domains/farm/farm.routes.js";
import farmProductRoutes from "./domains/farm-product/farm-product.routes.js";
import plantRoutes from "./domains/plant/plant.routes.js";
import harvestedRoutes from "./domains/farm-product/harvested/harvested.routes.js";
import plantedRoutes from "./domains/farm-product/planted/planted.routes.js";
import saleRoutes from "./domains/farm-product/sale/sale.routes.js";

const routes = [
  {
    path: "/farmer-auth",
    route: farmerAuthRoutes,
  },
  {
    path: "/customer-auth",
    route: customerAuthRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
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
  {
    path: "/harvested",
    route: harvestedRoutes,
  },
  {
    path: "/planted",
    route: plantedRoutes,
  },
  {
    path: "/sale",
    route: saleRoutes,
  },
];

export default routes;
