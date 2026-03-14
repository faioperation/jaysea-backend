import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";




import { MobileUserRoutes } from "../modules/MobileApp-Auth/mobileUser/mobileUser.route.js";
import { MobileAuthRoutes } from "../modules/MobileApp-Auth/mobileAuth/mobileAuth.route.js";
import { MobileOtpRoutes } from "../modules/MobileApp-Auth/mobileOtp/mobileOtp.route.js";
import { AgenManagementRoutes } from "../modules/agenManagement/agenManagement.route.js";
import { InstanceMessageRoutes } from "../modules/instanceMessage/instanceMessage.route.js";
import { MessageRoutes } from "../modules/messages/messages.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
  // user auth ends here
  {
    path: "/mobile/user",
    route: MobileUserRoutes,
  },
  {
    path: "/mobile/auth",
    route: MobileAuthRoutes,
  },
  {
    path: "/mobile/otp",
    route: MobileOtpRoutes,
  },

  // Mobile auth ends here
  {
    path: "/agen-management",
    route: AgenManagementRoutes,
  },
  // agent management ends here
  {
    path: "/instances",
    route: InstanceMessageRoutes,
  },
  {
    path: "/messages",
    route: MessageRoutes,
  },
  // instance message ends here
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});