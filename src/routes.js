import authRoutes from "./domains/auth/auth.routes.js";
import pvcScanRoutes from "./domains/pvc-scan/pvc-scan.routes.js";
import patientProfileRoutes from "./domains/patient-profile/patient-profile.routes.js";
import doctorProfileRoutes from "./domains/doctor-profile/doctor-profile.routes.js";

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
  {
    path: "/doctor-profile",
    route: doctorProfileRoutes,
  },
];

export default routes;
