import authRoutes from "./domains/auth/auth.routes.js";
import pvcScanRoutes from "./domains/pvc-scan/pvc-scan.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/pvc-scans",
    route: pvcScanRoutes,
  },
];

export default routes;
