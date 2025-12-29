import { Router } from "express";
import { signupUser, loginUser, logoutUser } from "../controllers/auth.controller";
import { createStaff, getStaffAccounts, deleteStaffAccount, updateToken } from "../controllers/admin.controller";
import { staffIsActive } from "../controllers/isActive.controller";
import { staffPassword } from "../controllers/staff.controller";
import verifyToken from "../middlewares/verifyToken.middleware";
import authorizeRoles from "../middlewares/authorizeRoles.middleware";
const router = Router();


router.post("/signup", signupUser);
router.post("/login", loginUser);

// ---------- Protected Admin Routes ----------
router.post(
  "/admin/create-staff",
  verifyToken,
  authorizeRoles("admin"),
  createStaff
);

router.get(
  "/admin/staffAccounts",
  verifyToken,
  authorizeRoles("admin"),
  getStaffAccounts
);

router.delete(
  "/admin/deleteStaff/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteStaffAccount
);

router.patch(
  "/admin/token/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateToken
);

router.post(
  "/staff/set-password",
  staffPassword
)

router.patch(
  "/admin/toggle-status/:id",
  staffIsActive
)

router.get(
  "/logout/:id",
  verifyToken,
  logoutUser
)

export default router;
  