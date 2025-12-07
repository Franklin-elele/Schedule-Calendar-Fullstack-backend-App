const express = require("express");
const { signupUser, loginUser, logoutUser } = require("../controllers/auth.controller");
const {
  createStaff,
  getStaffAccounts,
  deleteStaffAccount,
  updateToken,
} = require("../controllers/admin.controller");
const { staffIsActive } = require("../controllers/isActive.controller");
const { staffPassword } = require("../controllers/staff.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const authorizeRoles = require("../middlewares/authorizeRoles.middleware");
const router = express.Router();


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

module.exports = router;
  