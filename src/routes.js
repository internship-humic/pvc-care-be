import authRoutes from "./domains/auth/auth.routes.js";
import pvcScanRoutes from "./domains/pvc-scan/pvc-scan.routes.js";
import patientProfileRoutes from "./domains/patient-profile/patient-profile.routes.js";

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/pvc-scans",
    route: pvcScanRoutes,
  },
  {
    path: "/patient-profile",
    route: patientProfileRoutes,
  },
];

export default routes;
