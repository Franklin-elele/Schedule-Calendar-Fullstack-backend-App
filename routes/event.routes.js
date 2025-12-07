const express = require("express");
const {
  scheduledEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const authorizeRoles = require("../middlewares/authorizeRoles.middleware");
const router = express.Router();

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

module.exports = router;
