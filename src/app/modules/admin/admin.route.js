import { Router } from "express";
import { Role } from "../../utils/role.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { AdminController } from "./admin.controller.js";

const router = Router();

router.get(
  "/users",
  checkAuthMiddleware(Role.ADMIN, Role.SYSTEM_OWNER),
  AdminController.getAllUsers
);

router.get(
  "/mobile-users",
  checkAuthMiddleware(Role.ADMIN, Role.SYSTEM_OWNER),
  AdminController.getAllMobileUsers
);
router.get(
  "/mobile-users/for-ai",
  AdminController.getAllMobileUsers
);

export const AdminRoutes = router;
