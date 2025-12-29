import { Router } from "express";
import { scheduledEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";
const router = Router();

router.post(
  "/events",
  verifyToken,
  authorizeRoles("admin", "staff", "user"),
  scheduledEvent
);

router.get(
  "/events",
  verifyToken,
  authorizeRoles("admin", "staff", "user"),
  getAllEvents
);

router.get(
  "/events/:id",
  verifyToken,
  authorizeRoles("admin", "staff", "user"),
  getEventById
);

router.patch(
  "/events/:id",
  verifyToken,
  authorizeRoles("admin", "staff", "user"),
  updateEvent
);

router.delete(
  "/events/:id",
  verifyToken,
  authorizeRoles("admin", "staff", "user"),
  deleteEvent
);

export default router;
